import { DataTypes, Model, Optional } from "sequelize";
import { IUser } from "../interfaces/interfaces";
import sequelize from "../database/postgres";

interface IUserCreationAttributes extends Optional<IUser, "id"> {}

class User extends Model<IUser, IUserCreationAttributes> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{22}[./A-Za-z0-9]{31}$/,
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

export default User;
