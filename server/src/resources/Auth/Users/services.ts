import argon2 from "argon2"

export const hashPasswordService = async (rawPswd: string): Promise<string> => {
  return await argon2.hash(rawPswd)
}

export const verifyPasswordService = async (inputPswd: string, pswdHash: string): Promise<boolean> => {
  return await argon2.verify(pswdHash, inputPswd)
}
