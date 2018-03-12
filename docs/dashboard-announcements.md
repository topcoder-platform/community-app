# Dashboard Announcements
Here are some important remarks on the current implementation:

- Dashboard announcements can be created / edited via Contentful CMS. The meaning of all announcement options is commented inside the Contentful. Adding additional options is relatively easy, thus do not hesitate to ask for customization and new options.

- When you edit an announcement, Contentful CMS automatically saves the changes (see the *last saved* text under the **Publish**/**Publish changes** button). You do not have to press to press that button to save your changes, if you do not want to publish them yet! You can see the last saved (probably, not yet published) version of the announcement via the **Open Preview** button.

- The announcements published by **Publish**/**Publish changes** button is not shown in the Dashboard right away. The following logic for published announcements is implemented:
  - For each announcement you specify **Start Date** and **End Date** parameters;
  - At any moment, Dashboard shows one of the published announcements that satisfies the following criteria:
    1.  It is published;
    2.  Its **End Date** is in future;
    3.  Its **Start Date** is in past;
    4.  Its **Start Date** is the most recent among all announcements that satisfy previous conditions (a-c).
  - Announcements are cached by our system. Any changes you do can be seen immediately in the preview, but if you publish some change, a delay up to two minutes is possible before you see it in the production Dashboard.

- The previous point means that you can publish multiple announcement at the same time, and they will be shown one-a-time in the order you specify by their parameters. For example, if you create an announcement for a video stream in the Dashboard, the best approach is to create two separate announcements: one for the announcement of the upcoming live stream, and the other one (including the video itself) - to be shown at the exact stream time. Note that when announcement is changed, it is always shows up in open state in the members dashboard, until they collapse it explicitely. This way we ensure that they surely will notice any change of the announcement.

- ***One important thing:*** if you want to be sure that nobody sees you announcement before the time: do not publish it in advance!!! With the current implementation, while announcement is not published, only people knowing its ID can access it for the preview, and the ID can be found only by people having access to the CMS. However, due to the way the caching is implemented now, once your announcement is published, although it may be not yet shown in the Dashboard, its ID is remembered in the cache index, that everybody can access, if he study the code, or just look carefully at the network communication trace. Knowing the ID, one will be able to see your published announcement before the time, just pulling it manually via the cache!
