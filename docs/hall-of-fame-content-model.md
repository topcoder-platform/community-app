# Contentful - Content Model Guide

## Hall of Fame
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----:  |   :----:                             |
| Title                              | The type of Hall of Fame                           |   tco     |                                                   |
| versions                        |   The version of event. Year value, 2 digits |   17       |                                                  |
| All Time Champions        |    The data of All Time Champions                   |            |       HoF All Time Champions         |

## HoF All Time Champions
| Field                             | Note                                                         |  Example                              |  Link Model                      |
| :--------:              |:-----                                          | :----:                         |   :----:            |
| Title                              | The title of All Time Champions                   |   TCO All Time Champions     |                              |
| Icon                              |  The icon of each leaderboard                      |     The Trophy icon                                     |
| List                               |    The list of All Time Champions                  |                                           |       HoF Leaderboard Data  |

## HoF Leaderboard
| Field                             | Note                                                         |  Example                              |  Link Model                      |
| :--------:              |:-----                                          | :----:                         |   :----:            |
| Title                              | The title of Leaderboard                   |   TCO17 Finalists     |                              |
| Data                             |  The data of Leaderboard |                                     |          HoF Leaderboard Data                              |

## HoF Leaderboard Champion
| Field                             | Note                                                         |  Example                              |  Link Model                      |
| :--------:              |:-----                                          | :----:                         |   :----:            |
| Handle                             | The handle of member                   |   Wendell    |                              |
| Image                             |  The image of member             |                                        |

## HoF Leaderboard Data
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----:  |   :----:                             |
| Title                              | The title of Leaderboard                           |   ALGORITHM    |                                                   |
| Track                        |   The trank of Learderboard |  ALGORITHM       |                                                  |
| Champion        |    The champion of Leaderboard             |            |       HoF Leaderboard Champion         |
| Members        |    The members of Leaderboard             |            |       HoF Members         |

## HoF Members
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----:  |   :----:                             |
| Handle                         | The handle of member                             |   Wendell    |                                                   |
| Value                       |   Default value is blank. This value is currently use for all time champion. |  3       |                  |

## HoF Promo
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----:  |   :----:                             |
| Logo                        | The logo of event                            |     |                                                   |
| Banner Image                      |   The banner of event |         |                  |
| Title                      |   The title of event |         |                  |
| Description                     |   The description of event |         |                  |
| Links                   |   The links of event |         |         HoF Promo Link         |
| Statistics                   |   The Statistics of event |         |        HoF Promo Statistics        |
| Attributes                  |   The Attributes of event |         |        HoF Promo Statistics        |


## HoF Promo Link
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----:  |   :----:                             |
| URL                       | The url of link                     |   http://tco16.topcoder.com/    |                                                   |
| Title                     |   The title of link |  Learn More      |                  |
| CSS Style                    |   The style of link |       |                  |

## HoF Promo Statistics
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----:  |   :----:                             |
| Value                      | The value of Statistics                    |   $60,000    |                                                   |
| Description                   |   The label of Statistics | Total Prizes    |                  |
| Icon                  |   The icon of Statistics |        |                  |

## HoF Quick Story
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----  |   :----:                             |
| Image                  | The image of story                    |   $60,000    |                                                   |
| Text                 |   The text of story | 2017 was Psyho's 10th year competing in the Topcoder Open.    |                  |

## HoF Stories
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----  |   :----:                             |
| Title                | The title of Stories           |   Fun Facts    |                                                   |
| List           |   The data of stories |   |       HoF Quick Story           |


## HoF Version
| Field                             | Note                                                         |  Example  |  Link Model                                 |
| :--------:              |:-----                                          | :----  |   :----:                             |
| Version ID                | The id of event version           |   17    |                                                   |
| Promo                     |   The data of event Promo |   |     HoF Promo          |
| Leaderboards         |   The data of Leaderboards |   |     HoF Leaderboard          |
| Quick Stories          |   The stories of event         |        |     HoF Stories         |