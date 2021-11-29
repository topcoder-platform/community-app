# App Component
Generic App Component model.

## Fields
- **Name** | Name of the entry.  
- **Type** | Type of the App Component. Each type has different props. Please refer to [props](#props) field below.  
- **Theme** | Theme specific for `TCO-Leaderboard` type.  
- **Props** | Each type has its own props. Please refer to [props](#props) field below.  

## TCO-Leaderboard Themes
### Default
![default-theme](./pics/AppComponent/default-theme.png)
### TCO20
![tco20-theme](./pics/AppComponent/tco20-theme.png)
### TCO22
![tco22-theme](./pics/AppComponent/tco22-theme.png)

## Props (JSON Object)
### Type = `TCO-Leaderboard`
Render top spots and list of competitors on specific TCO track.
- **apiUrl** | String. Looks API URL | Default: "https://api.topcoder.com/v4/looks/1044/run/json".  
- **title** | String. Title of the leaderboard. | Default: "Leaderboard".  
- **podiumSpots** | Number. Number of displayed top spots. | Default: 3.  
- **isCopilot** | Bool. Display copilot specific fields. | Default: false  
- **hasChallengeHistory** | Bool. Display modal of competitor history. | Default: true  
- **tcoPointsApiUrl** | String. Looks API URL for competitior challenge history. | Default: null  
- **memberLimit** | Number. Limit the displayed number of rows. | Default: null  
- **isAlgo** | Bool. Display copilot specific fields. | Default: false  

### Type = `GSheet`
Render table that load data from Google Sheet.  
- **id** | String (Required). Google sheet ID.  
- **index** | Number. ???.  
- **config** | Object of:  
  - **pick** | Array of Strings. Pick sheet header value as table header.  
  - **containerStyle** | Inline styles object to override the container style.  
- **sheet** | ???.  
- **getGSheet** | Function. ???.  
