
import { StatusCodes } from 'http-status-codes';
import {  Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

import { jwtHelper } from '../../../helpers/jwtHelper';

import {
 
  ILoginData,

} from '../../../types/auth';

import { User } from '../user/user.model';

//login
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;
  const isExistUser = await User.findOne({ email }).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }



  //check match password
  if (
    password &&
    !(await User.isMatchPassword(password, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }
  const jwtPayload = {
    id: isExistUser._id,
    role: isExistUser.role,
    email: isExistUser.email,
  };
  //create token
  const accessToken = jwtHelper.createToken(
    jwtPayload,
    config.jwt.jwt_access_token_secret as Secret,
    config.jwt.access_token_expire_in as string
  );
  const refreshToken = jwtHelper.createToken(
    jwtPayload,
    config.jwt.jwt_refresh_token_secret as Secret,
    config.jwt.refresh_token_expire_in as string
  );

  return { accessToken, refreshToken };
};



// resend otp again



const refreshToken = async (token: string) => {
  const decoded = jwtHelper.verifyToken(
    token,
    config.jwt.jwt_refresh_token_secret as string
  );
  const { id } = decoded;

  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found');
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again'
    );
  }

  //check user status
  if (isExistUser.status === 'delete') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'It looks like your account has been deactivated.'
    );
  }

  const jwtPayload = {
    id: isExistUser._id,
    role: isExistUser.role,
    email: isExistUser.email,
  };
  //create token
  const accessToken = jwtHelper.createToken(
    jwtPayload,
    config.jwt.jwt_access_token_secret as Secret,
    config.jwt.access_token_expire_in as string
  );
  return { accessToken };
};

export const AuthService = {
 
  loginUserFromDB,
  
  refreshToken,
};
