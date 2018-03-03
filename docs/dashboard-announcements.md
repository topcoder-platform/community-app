# Dashboard Announcements
Here are some important remarks on the current implementation:

- Dashboard announcements can be created / edited via Contentful CMS. The meaning of all announcement options is commented inside the Contentful. Adding additional options is relatively easy, thus do not hesitate to ask for customization and new options.

- When you edit an announcement, Contentful CMS automatically saves the changes (see the *last saved* text under the **Publish**/**Publish changes** button). You do not have to press to press that button to save your changes, if you do not want to publish them yet!

- The announcements published by **Publish**/**Publish changes** button is not shown in the Dashboard right away. The following logic for published announcements is implemented:
  - For each announcement you specify **Start Date** and **End Date** parameters;
  - At any moment, Dashboard shows one of the published announcements that satisfies the following criteria:
    1.  It is published;
    2.  Its **End Date** is in future;
    3.  Its **Start Date** is in past;
    4.  Its **Start Date** is the most recent among all announcements that satisfy previous conditions (1-3).
