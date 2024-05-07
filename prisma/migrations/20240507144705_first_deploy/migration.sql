-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('VOLUNTEER', 'ADMIN', 'GUEST');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REJECTED', 'ACCEPTED', 'ENDED');

-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('IN_USE', 'NOT_IN_USE', 'IN_REPAIR', 'IN_MAINTENANCE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannedEmails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannedEmails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "username" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userType" "UserType" NOT NULL DEFAULT 'GUEST',
    "last_login" TIMESTAMP(3),
    "person_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "icon" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availability" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE',
    "principalImage" TEXT,
    "comercialDescription" TEXT,
    "comercialResume" TEXT,
    "label" TEXT,
    "pieces" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiometricPosts" (
    "id" TEXT NOT NULL,
    "who_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BiometricPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirQualityWeather" (
    "id" TEXT NOT NULL,
    "weather_log_id" TEXT NOT NULL,
    "carbon_monoxide" DOUBLE PRECISION,
    "ozone" DOUBLE PRECISION,
    "nitrogen_dioxide" DOUBLE PRECISION,
    "sulfur_dioxide" DOUBLE PRECISION,
    "particulate_matter_10" DOUBLE PRECISION,
    "particulate_matter_25" DOUBLE PRECISION,
    "particulate_matter_100" DOUBLE PRECISION,
    "us_epa_index" INTEGER,
    "gb_defra_index" INTEGER,

    CONSTRAINT "AirQualityWeather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherLogs" (
    "id" TEXT NOT NULL,
    "biometric_post_id" TEXT NOT NULL,
    "temperature_c" DOUBLE PRECISION NOT NULL,
    "wind_dir" TEXT NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "precipitation_mm" DOUBLE PRECISION NOT NULL,
    "cloud" INTEGER NOT NULL,
    "wind_speed_kmh" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedence" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Procedence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteers" (
    "id" TEXT NOT NULL,
    "biometric_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "f_lastname" TEXT,
    "m_lastname" TEXT,
    "ci" TEXT,
    "birthdate" TIMESTAMP(3),
    "gender_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhonesPersons" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,

    CONSTRAINT "PhonesPersons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailsPersons" (
    "id" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "deleteable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmailsPersons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "person_id" TEXT,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerApplication" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "user_id" TEXT NOT NULL,
    "approved_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsDates" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectsDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingDates" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "volunteer_id" TEXT NOT NULL,

    CONSTRAINT "TrackingDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" SMALLINT NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "ProjectTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsTaskDates" (
    "id" TEXT NOT NULL,
    "project_task_id" TEXT NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectsTaskDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTaskComments" (
    "id" TEXT NOT NULL,
    "volunteer_id" TEXT NOT NULL,
    "said_at" TIMESTAMP(3) NOT NULL,
    "said" TEXT NOT NULL,
    "project_task_id" TEXT,

    CONSTRAINT "ProjectTaskComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroTasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "task_comment" TEXT,

    CONSTRAINT "MicroTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroTaskDates" (
    "id" TEXT NOT NULL,
    "micro_task_id" TEXT NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MicroTaskDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineUsageMicroTasks" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "micro_task_id" TEXT NOT NULL,

    CONSTRAINT "MachineUsageMicroTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "MachineStatus" NOT NULL DEFAULT 'NOT_IN_USE',
    "image" TEXT,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "Machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineMaintenance" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "MachineStatus" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InventoryToProvider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SkillsToVolunteers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProcedenceToVolunteers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilesToPersons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectFiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InventoryFiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InventoryImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilesToProjectTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilesToMicroTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilesToMachines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectsToVolunteers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectTasksToVolunteers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MicroTasksToVolunteers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "BannedEmails_email_key" ON "BannedEmails"("email");

-- CreateIndex
CREATE INDEX "BannedEmails_email_idx" ON "BannedEmails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_person_id_key" ON "User"("person_id");

-- CreateIndex
CREATE INDEX "User_userType_idx" ON "User"("userType");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteers_biometric_id_key" ON "Volunteers"("biometric_id");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteers_user_id_key" ON "Volunteers"("user_id");

-- CreateIndex
CREATE INDEX "Persons_name_f_lastname_m_lastname_ci_deleted_at_idx" ON "Persons"("name", "f_lastname", "m_lastname", "ci", "deleted_at");

-- CreateIndex
CREATE INDEX "VolunteerApplication_user_id_approved_by_id_idx" ON "VolunteerApplication"("user_id", "approved_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "_InventoryToProvider_AB_unique" ON "_InventoryToProvider"("A", "B");

-- CreateIndex
CREATE INDEX "_InventoryToProvider_B_index" ON "_InventoryToProvider"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillsToVolunteers_AB_unique" ON "_SkillsToVolunteers"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillsToVolunteers_B_index" ON "_SkillsToVolunteers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProcedenceToVolunteers_AB_unique" ON "_ProcedenceToVolunteers"("A", "B");

-- CreateIndex
CREATE INDEX "_ProcedenceToVolunteers_B_index" ON "_ProcedenceToVolunteers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilesToPersons_AB_unique" ON "_FilesToPersons"("A", "B");

-- CreateIndex
CREATE INDEX "_FilesToPersons_B_index" ON "_FilesToPersons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectFiles_AB_unique" ON "_ProjectFiles"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectFiles_B_index" ON "_ProjectFiles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectImages_AB_unique" ON "_ProjectImages"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectImages_B_index" ON "_ProjectImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InventoryFiles_AB_unique" ON "_InventoryFiles"("A", "B");

-- CreateIndex
CREATE INDEX "_InventoryFiles_B_index" ON "_InventoryFiles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InventoryImages_AB_unique" ON "_InventoryImages"("A", "B");

-- CreateIndex
CREATE INDEX "_InventoryImages_B_index" ON "_InventoryImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilesToProjectTasks_AB_unique" ON "_FilesToProjectTasks"("A", "B");

-- CreateIndex
CREATE INDEX "_FilesToProjectTasks_B_index" ON "_FilesToProjectTasks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilesToMicroTasks_AB_unique" ON "_FilesToMicroTasks"("A", "B");

-- CreateIndex
CREATE INDEX "_FilesToMicroTasks_B_index" ON "_FilesToMicroTasks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilesToMachines_AB_unique" ON "_FilesToMachines"("A", "B");

-- CreateIndex
CREATE INDEX "_FilesToMachines_B_index" ON "_FilesToMachines"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectsToVolunteers_AB_unique" ON "_ProjectsToVolunteers"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectsToVolunteers_B_index" ON "_ProjectsToVolunteers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectTasksToVolunteers_AB_unique" ON "_ProjectTasksToVolunteers"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectTasksToVolunteers_B_index" ON "_ProjectTasksToVolunteers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MicroTasksToVolunteers_AB_unique" ON "_MicroTasksToVolunteers"("A", "B");

-- CreateIndex
CREATE INDEX "_MicroTasksToVolunteers_B_index" ON "_MicroTasksToVolunteers"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricPosts" ADD CONSTRAINT "BiometricPosts_who_id_fkey" FOREIGN KEY ("who_id") REFERENCES "Volunteers"("biometric_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AirQualityWeather" ADD CONSTRAINT "AirQualityWeather_weather_log_id_fkey" FOREIGN KEY ("weather_log_id") REFERENCES "WeatherLogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WeatherLogs" ADD CONSTRAINT "WeatherLogs_biometric_post_id_fkey" FOREIGN KEY ("biometric_post_id") REFERENCES "BiometricPosts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Volunteers" ADD CONSTRAINT "Volunteers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persons" ADD CONSTRAINT "Persons_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Genders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PhonesPersons" ADD CONSTRAINT "PhonesPersons_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailsPersons" ADD CONSTRAINT "EmailsPersons_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerApplication" ADD CONSTRAINT "VolunteerApplication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerApplication" ADD CONSTRAINT "VolunteerApplication_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProjectsDates" ADD CONSTRAINT "ProjectsDates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsDates" ADD CONSTRAINT "ProjectsDates_tracking_id_fkey" FOREIGN KEY ("tracking_id") REFERENCES "TrackingDates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingDates" ADD CONSTRAINT "TrackingDates_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsTaskDates" ADD CONSTRAINT "ProjectsTaskDates_project_task_id_fkey" FOREIGN KEY ("project_task_id") REFERENCES "ProjectTasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsTaskDates" ADD CONSTRAINT "ProjectsTaskDates_tracking_id_fkey" FOREIGN KEY ("tracking_id") REFERENCES "TrackingDates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTaskComments" ADD CONSTRAINT "ProjectTaskComments_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTaskComments" ADD CONSTRAINT "ProjectTaskComments_project_task_id_fkey" FOREIGN KEY ("project_task_id") REFERENCES "ProjectTasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroTaskDates" ADD CONSTRAINT "MicroTaskDates_micro_task_id_fkey" FOREIGN KEY ("micro_task_id") REFERENCES "MicroTasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroTaskDates" ADD CONSTRAINT "MicroTaskDates_tracking_id_fkey" FOREIGN KEY ("tracking_id") REFERENCES "TrackingDates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineUsageMicroTasks" ADD CONSTRAINT "MachineUsageMicroTasks_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineUsageMicroTasks" ADD CONSTRAINT "MachineUsageMicroTasks_micro_task_id_fkey" FOREIGN KEY ("micro_task_id") REFERENCES "MicroTasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machines" ADD CONSTRAINT "Machines_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineMaintenance" ADD CONSTRAINT "MachineMaintenance_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineMaintenance" ADD CONSTRAINT "MachineMaintenance_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryToProvider" ADD CONSTRAINT "_InventoryToProvider_A_fkey" FOREIGN KEY ("A") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryToProvider" ADD CONSTRAINT "_InventoryToProvider_B_fkey" FOREIGN KEY ("B") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillsToVolunteers" ADD CONSTRAINT "_SkillsToVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillsToVolunteers" ADD CONSTRAINT "_SkillsToVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcedenceToVolunteers" ADD CONSTRAINT "_ProcedenceToVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "Procedence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcedenceToVolunteers" ADD CONSTRAINT "_ProcedenceToVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToPersons" ADD CONSTRAINT "_FilesToPersons_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToPersons" ADD CONSTRAINT "_FilesToPersons_B_fkey" FOREIGN KEY ("B") REFERENCES "Persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectFiles" ADD CONSTRAINT "_ProjectFiles_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectFiles" ADD CONSTRAINT "_ProjectFiles_B_fkey" FOREIGN KEY ("B") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectImages" ADD CONSTRAINT "_ProjectImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectImages" ADD CONSTRAINT "_ProjectImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryFiles" ADD CONSTRAINT "_InventoryFiles_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryFiles" ADD CONSTRAINT "_InventoryFiles_B_fkey" FOREIGN KEY ("B") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryImages" ADD CONSTRAINT "_InventoryImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryImages" ADD CONSTRAINT "_InventoryImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToProjectTasks" ADD CONSTRAINT "_FilesToProjectTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToProjectTasks" ADD CONSTRAINT "_FilesToProjectTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToMicroTasks" ADD CONSTRAINT "_FilesToMicroTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToMicroTasks" ADD CONSTRAINT "_FilesToMicroTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "MicroTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToMachines" ADD CONSTRAINT "_FilesToMachines_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilesToMachines" ADD CONSTRAINT "_FilesToMachines_B_fkey" FOREIGN KEY ("B") REFERENCES "Machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectsToVolunteers" ADD CONSTRAINT "_ProjectsToVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectsToVolunteers" ADD CONSTRAINT "_ProjectsToVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTasksToVolunteers" ADD CONSTRAINT "_ProjectTasksToVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTasksToVolunteers" ADD CONSTRAINT "_ProjectTasksToVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MicroTasksToVolunteers" ADD CONSTRAINT "_MicroTasksToVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "MicroTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MicroTasksToVolunteers" ADD CONSTRAINT "_MicroTasksToVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
