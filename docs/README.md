# FabLab Utils

FabLab Utils is a proyect dedicated to manage the FabLab in the University of Franz Tamayo, Santa Cruz - Bolivia

This project has some modules that might be of interest if you're looking for:

- Volunteers Registering

  - Basic Contact Details
  - Skills
  - Availability (Prefered days, this have to be asked)
  - Experience per area
  - Aditional comments
  - Tasks
  - Certificates
- Areas registry (CNC, Laser, 3D, VR)
- Inventory

  - Category (Raw materials, consumables, tools, electronics)
  - Location
  - Usage Tracking(who used it, project associated to, when it happen, returned?)
  - Supplier (Where this came from, which price? if its handcrafted from what project?)
  - Quantity(To register more than one of a kind)
  - DataSheets/Manuals (If handcrafted)
  - QR Label generation (Might be?, per item)
  - -------Usage Prediction for materials with IA
- Jobs tracking

  - Project Management
    - Basic details like required materiales, required machines, due date, owner, all if applicable
      - File Designs, all of the linked to a public git repository (Can it be self hosted on gitea?)
    - Project documentation about assembly, safety guidelines, etc
    - Estimated costs and machine times
  - Job Stages by project
    - Design, prototyping, finished
    - Splitting in micro tasks
    - Timing by job/task
    - ---Check if you can more than one machine at a time both machines--
- Machine Status Monitoring

  - Real Time Status (If posible, an api that every n time updates the status, must be always connected for this)
    - Here, for 3D printing, "the spaguetti detective".
      - https://obico.io/docs/user-guides/how-to-test-failure-detection/
      - Self hosted: https://github.com/TheSpaghettiDetective/obico-server (AGPL V3)
    - OctoEverywhere is an alternative, but none of this are self hosted
      - https://octoeverywhere.com/
    - SimpliPrint https://simplyprint.io/alternatives/octoeverywhere/ (But Idk if this offers an api for integration)
  - Linked Job (Why is actually in use, what is the project doing)
  - ETA if measurable (Per machine, like 3d printers)
  - Manual per machine
  - Mainteneance tracking
- Logging of all above(amazon cloudwatch)
