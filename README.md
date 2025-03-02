Kanban Full stack project

Application where logged in users can make to do cards into different columns. User can create as many columns, cards, and comments as he/she wants. Attributes in items are editable by clicking. Cards can be reordered within the column or dragged to another columns.

The project uses Node.js and Express.js on the backend, MongoDB as a database, and React with TypeScript
in the frontend.


Video demonstration: https://youtu.be/UStY9qW8WNk


![image](https://github.com/user-attachments/assets/66aa7d39-9e20-45da-bed1-a5dbd5ccece5)

![image](https://github.com/user-attachments/assets/7d13772c-03d9-4868-85fd-8f6f28317d94)


Installation guide
1. Open IDE (Visual Studio Code etc.)
2. Create empty folder
3. Open created folder and open terminal
4. type git clone https://github.com/antti-kuru/Kanban_full-stack.git
5. move to kanban_full-stack folder by cd kanban_full-stack/
6. install all packages by typing npm install in the kanban_full-stack/ folder
7. start application by typing npm start dev (this starts both frontend and backend)
8. click the http://localhost:3000/ link in the terminal
9. you are good to go

User manual
1. First you have option to login or register. If you open the app for the first time, you don’t have
existing account so at the first-time press Register
2. Create an account and be sure to follow the criteria for username and password. If one of the
criteria is not met, you are unable to register.
3. After successful register you are directed to login page where you log in with you created account
4. After successful login you are directed to Kanban Board page
5. Start adding columns from “Add column” button
6. Start adding cards to columns from “Add card” button / delete created columns from “Delete
column” button
7. To reorder
a.) press “Drag here to change order” text
b.) Reorder cards by your liking
c.) press “Save edits” button that will display below the cards in the column
8. To drag cards between columns
a. press some portion of the card and drag it to another column
9. Delete card
a. press “Delete card” Button
10. Add comment
a. press “Add comment” button
b. Type content of the comment and submit
11. Rename any attribute
a. press any attribute you want to edit and press “Save”
12. Logout
a. press “Logout” in the navigation bar


