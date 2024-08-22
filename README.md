# An application supporting classroom management at a university.
> [!NOTE]
> The application's interface was written in Polish because it was developed for an engineering thesis.

<p>The application allows all users to check the schedules of various student groups, helps instructors reserve classrooms, and assists schedulers in creating timetables. The system enables users to input data about specific class blocks, which will be added to the database. This process allows the class block to be displayed on the calendar located in the main view of the application, with each block appearing weekly at its designated time. Instructors, unlike schedulers, can make a reservation only for a single specific time slot (schedulers have the ability to create recurring blocks). For example, if an instructor reserves a classroom for a two-hour block on Monday, May 8, 2024, at 10:00 AM, the reservation will not extend to May 13, 2024, or any other date. Using the system, the blocks they input will appear in the database for the selected student group. Users can filter records to find the desired schedule.</p>


> [!IMPORTANT]
> Note that to run the application on your device, you will need an **IDE** such as IntelliJ IDEA or Eclipse, a **text editor** like Visual Studio Code and **Docker** software


Instructions to launch the application:

- Start the Docker program.
- Open the contents of the "*Back-End*" folder in your **IDE**.
- Open the **terminal** in the IDE and type "***docker-compose up***".
- Once Docker has set up its container and it is running, you can start the project by using *Maven* with "***mvn spring-boot:run***", or by opening the "*DiplomaApplication.java*" file in the IDE and clicking the "**Run**" button.
- Next, open the project located in the "*Front-End*" folder in **Visual Studio Code**.
- Open the terminal and type "***npm install***". After a successful installation, type "***ng serve***".
- You can now open a web browser and go to "***http://localhost:4200***".
- Upon the first launch, the database ***contains only one user profile*** that you can log into, which is the Admin account:
- 1. Username: admin 
  2. Password: adminPassword

> [!NOTE]
> Below are a few screenshots of the application.


## Login panel
![Screenshot of login panel](https://i.imgur.com/GYAOH7A.png)

## Main page
![Screenshot of main page](https://i.imgur.com/TRdYTpv.png)

## Main page with schedule
![Screenshot of main page after filtering desire schedule](https://i.imgur.com/seSWmfm.png)

## Menu
![Screenshot of slide bar menu](https://i.imgur.com/D2kbc4b.png)

## Data editing page
![Screenshot of data editing page with some of records](https://i.imgur.com/kWf5IhK.png)
