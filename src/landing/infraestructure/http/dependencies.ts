import { MongoTemplateRepository } from "../../../templates/infraestructure/mongo/mongo-template-repository"
import { MongoUserRepository } from "../../../users/infrastructure/mongo/mongo-user-repository"
import { LandingUseCase } from "../../application/landing-use-case"
import { MongoLandingRepository } from "../mongo/mongo-landing-repository"
import { LandingController } from "./landing-controller"

const templateRepo = new MongoTemplateRepository()
const userRepo = MongoUserRepository.getInstance()
const landingRepo = new MongoLandingRepository()

const landingUseCase = new LandingUseCase(userRepo, templateRepo, landingRepo)
export const landingCtrl = new LandingController(landingUseCase)