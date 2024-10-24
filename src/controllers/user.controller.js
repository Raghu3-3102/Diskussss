import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { apiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken'
import { sendmail } from '../services/mail.service.js'
import { otpSendHtml,forgotPasswordHtml } from '../constant.js'
// import {storeOtp} from '../services/RedisSetup.service.js'
// import { sendMessage } from '../services/message.service.js'
import NodeCache from 'node-cache';

const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const verificationCodeMail = async (email) => {
  const verificationCode = generateVerificationCode();
  otpCache.set(email, verificationCode);
  
  
  
  const isMailSent = await sendmail(email, otpSendHtml(verificationCode), 'Your OTP Code - Diskuss')
  if (isMailSent) {
    return verificationCode;
  } else {
    throw new apiError(500, 'Something went wrong while sending OTP');
  }
}

const verificationCodeForgotPassword = async (email) => {
  const verificationCode = generateVerificationCode();
  otpCache.set(email, verificationCode);
  console.log(email, verificationCode);
  
  
  const isMailSent = await sendmail(email, forgotPasswordHtml(verificationCode), 'Your OTP Code - Diskuss')
  if (isMailSent) {
    return verificationCode;
  } else {
    throw new apiError(500, 'Something went wrong while sending OTP');
  }
}

// const verificationCodePhone = async (phoneNumber) => {
//   const verificationCode = generateVerificationCode();
//   otpCache.set(phoneNumber, verificationCode);
//   const isMailSent =  sendMessage(phoneNumber,verificationCode)
//   if (isMailSent) {
//     return verificationCode;
//   } else {
//     throw new apiError(500, 'Something went wrong while sending OTP');
//   }
// }

const verifyUser = (identifier, enteredOtp) => {
  try {
    const storedOtp = otpCache.get(identifier); // identifier could be email or phone
    
    
    if (storedOtp && storedOtp === enteredOtp) {
      otpCache.del(identifier); // OTP is valid, remove from cache
      return true;
    } else {
      return false;
    }
  } catch (error) { 
    throw new apiError(500, 'Error in verifying user');
  }
}

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = await user.generateAuthToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new apiError(500, 'Error in generating tokens')
  }

}

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password,confirmPassword } = req.body
      console.log( username, email, password,confirmPassword );
      
    if (
      [username, email, password, confirmPassword].some((field) => field?.trim() === "")
    ) {
      throw new apiError(400, 'Please fill all the required fields')
    }
  
    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    })
    if (existedUser) {
      throw new apiError(400, 'User already exists')
    }

    if (password != confirmPassword) {
      throw new apiError(400, 'password does not match')
    }
    await verificationCodeMail(email)

    await User.create({
      username,
      email,
      password,
      
      
    });
    return res.status(201).send({ success: true, message: 'OTP verficaton sent succesfuly' });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Error in registering user', error: error.message });
    
  }
})

const verificationOtp = asyncHandler(async (req, res) => {
  try {
    const { email,username,emailOtp } = req.body
      
      
   const isUserVerified =   verifyUser(email,emailOtp)
   
   if (!isUserVerified) {
    throw new apiError(400, 'Enterd OTP is wrong')
   }

   const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  })
  if (existedUser.isVerified) {
    throw new apiError(400, 'User allredy verified')
  }

  
  existedUser.isVerified = true

  const updatedUser = await existedUser.save();

  if (!updatedUser) {
    
    throw new apiError(400, 'User not verified')


  }

    
    return res.status(201).send({ success: true, message: 'OTP verified Sucessfully' });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Error in registering user', error: error.message });
    
  }
})



const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body
  
    if (!(email )) {
      return res.status(201).send({ sucess: false, message: 'Plese fill all reaqured field' })
    }
  
    const user = await User.findOne({ $or: [{ email }] })
  
    if (!user) {
      return res.status(404).send({ sucess: false, message: 'user does not exist' })
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password)
  
    if (!isPasswordValid) {
      return res.status(400).send({ sucess: false, message: 'Invalid password' })
    }

    if (user.isVerified) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
  
      const loggedInUser = await User.findById(user._id).select('-password -refreshToken')
    
      const options = {
        httpOnly: true,
        secure: true
      }
  
  
    
    
    
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new apiResponse(200, { 
        user: loggedInUser,
        accessToken,
        refreshToken
      }, 'User logged in successfully'));
    }

    return res.status(400).send({ sucess: false, message: 'User not verified' })

  
  
  } catch (error) {
    throw new apiError(500, 'Error in logging in user')
    
  }

})

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        refreshToken: 1
      },
    })
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new apiResponse(200, 'User logged out successfully'))
  
  } catch (error) {
    throw new apiError(500, 'Error in logging out user')
    
  }

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new apiError(401, 'Unauthorized Request')
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new apiError(401, 'Unauthorized Request')
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new apiError(401, 'Unauthorized Request')
    }
    const option = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", newRefreshToken, option).json(new apiResponse(
      200, {
        accessToken,
      refreshToken: newRefreshToken
    },
      'Token refreshed successfully'))
  } catch (error) {
    throw new apiError(401, error?.message || 'Unauthorized Request')

  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword, confPassword } = req.body
  
    if (newPassword !== confPassword) {
      throw new apiError(400, 'Passwords do not match')
    }
  
    if (!currentPassword || !newPassword) {
      throw new apiError(400, 'Please fill all the required fields')
    }
  
    const user = await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordCorrect(currentPassword)
    if (!isPasswordValid) {
      throw new apiError(400, 'Invalid password')
    }
    user.password = newPassword
  
    await user.save({ validateBeforeSave: false })
  
    return res
      .status(200)
      .json(new apiResponse(200, {}, 'Password changed successfully'))
  } catch (error) {
    throw new apiError(500, 'Error in changing password')
    
  }


})

const ForgotPasswordSentOtp = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body
  
    const user = await User.findOne({ $or: [{ email }]})
    
    if (!user) {
      throw new apiError(400, 'User does not exist')
    }

    await  verificationCodeForgotPassword(email);
    
  
    return res
      .status(200)
      .json(new apiResponse(200, {}, 'Code sent succsefully'))
  } catch (error) {
    throw new apiError(500, 'Error in sending password')
    
  }


})

const VerifyOtpForgetPaasword = asyncHandler(async (req, res) => {
  try {
    const { email,changePasswordOtp } = req.body
  
    const user = await User.findOne({ $or: [{ email }]})
    
    if (!user) {
      throw new apiError(400, 'User does not exist')
    }

   const OtpFlag =  verifyUser(email,changePasswordOtp)
   if (OtpFlag == false) {
    
    throw new apiError(400, 'OTP IS wrong')

   }

   user.isForgotPassword = true

  const updatedUser = await user.save();
    
  
    return res
      .status(200)
      .json(new apiResponse(200, {}, 'Code sent succsefully'))
  } catch (error) {
    throw new apiError(500, 'Error in sending password')
    
  }


})

const changpassword = asyncHandler(async(req,res)=>{

  const {email,newPaasword,confirmPassword} = req.body;

  const user = await User.findOne({ $or: [{ email }]});

  if (user.isForgotPassword == false) {
      throw new apiError(500, 'OTP verification failed')
  }

  


})

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(new apiResponse(200, req.user, 'User fetched succesfully'))
} catch (error) {
  throw new apiError(500, 'Error in fetching user')
  
}
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  verifyUser,
  verificationCodeMail,
  verificationOtp,
  ForgotPasswordSentOtp

}