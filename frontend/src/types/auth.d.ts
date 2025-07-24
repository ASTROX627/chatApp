export type RegisterFormValue = {
  fullName: string,
  username: string,
  password: string,
  confirmPassword: string,
  gender: "male" | "female"
}

export type LoginFromValue = {
  username: string,
  password: string
}

export type AuthResponse = {
  user: {
    _id: string,
    fullName: string,
    username: string,
    gender: "male" | "female"
    profilePicture: string
  }
}

export type AuthRequestData = RegisterFormValue | LoginFromValue | null;