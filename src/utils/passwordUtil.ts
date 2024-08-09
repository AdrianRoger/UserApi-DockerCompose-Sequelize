import bcrypt from "bcryptjs";

export const hashPassword = async (pw: string): Promise<string> => {
  try {
    const salt: string = await bcrypt.genSaltSync(10);
    return await bcrypt.hashSync(pw, salt);
  } catch (err) {
    console.error("Erro ao gerar o hash da senha:: ", err);
    return "";
  }
};

export const comparePassword = async (
  pw: string,
  hashed: string
): Promise<boolean> => {
  try {
    return await bcrypt.compareSync(pw, hashed);
  } catch (err) {
    console.error("Erro ao comparar senhas:: ", err);
    return false;
  }
};
