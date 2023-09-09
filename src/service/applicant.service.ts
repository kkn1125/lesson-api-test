import MariadbConfig from "@src/database/mariadb.config";
import Applicant from "@src/entity/applicant.entity";
import { Repository } from "typeorm";

export default class ApplicantService {
  stringArray = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  baseId = "x".repeat(32) + "y".repeat(16);
  basePassword = "x".repeat(64) + "y".repeat(32);

  repository: Repository<Applicant> = MariadbConfig.getRepository(Applicant);

  getRandomStringKey(): string {
    return this.stringArray[
      Math.floor(Math.random() * this.stringArray.length)
    ];
  }

  getRandomNumberKey(): string {
    return this.numberArray[
      Math.floor(Math.random() * this.numberArray.length)
    ].toString();
  }

  getRandomId() {
    return this.baseId.replace(/x|y/g, ($1) =>
      $1 === "x" ? this.getRandomStringKey() : this.getRandomNumberKey()
    );
  }

  getRandomPassword() {
    return this.basePassword.replace(/x|y/g, ($1) =>
      $1 === "x" ? this.getRandomStringKey() : this.getRandomNumberKey()
    );
  }

  getOneTimeUserAccount() {
    return {
      user_id: this.getRandomId(),
      user_password: this.getRandomPassword(),
    };
  }
}
