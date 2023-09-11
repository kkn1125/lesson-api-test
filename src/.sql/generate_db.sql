DROP SCHEMA IF EXISTS custom;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema custom
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema custom
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `custom` DEFAULT CHARACTER SET utf8 ;
USE `custom` ;

-- -----------------------------------------------------
-- Table `custom`.`court`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `custom`.`court` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `num` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `custom`.`coach`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `custom`.`coach` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `custom`.`applicant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `custom`.`applicant` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(50) NULL,
  `user_password` VARCHAR(150) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `custom`.`schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `custom`.`schedule` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `court_id` INT NOT NULL,
  `coach_id` INT NOT NULL,
  `applicant_id` INT NOT NULL,
  `time` DATETIME NOT NULL,
  `duration` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_schedule_court_idx` (`court_id` ASC) VISIBLE,
  INDEX `fk_schedule_coach1_idx` (`coach_id` ASC) VISIBLE,
  INDEX `fk_schedule_applicant1_idx` (`applicant_id` ASC) VISIBLE,
  CONSTRAINT `fk_schedule_court`
    FOREIGN KEY (`court_id`)
    REFERENCES `custom`.`court` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_schedule_coach1`
    FOREIGN KEY (`coach_id`)
    REFERENCES `custom`.`coach` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_schedule_applicant1`
    FOREIGN KEY (`applicant_id`)
    REFERENCES `custom`.`applicant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
