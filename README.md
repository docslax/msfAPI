# msfAPI
_API for interacting and retrieving character &amp; gear data for MSF_

__Currently supported endpoints__

- /v1/characters 
    Get a complete list of characters
- /v1/character/:charId
    Get stat & gear tier details for a specific character
- /v1/character/:charId/:tierLevel
    Get gear details for a specific tier level
- /v1/detail/:charId
    Get ability and character details eg. traits, unlock, description
- /v1/detail/:charId/tags
    Get a list of tags for the specified character
- /v1/gear/:gearId/:tier?
    Get details about a gear piece, include tier to filter down. 
    Note: After the top level, mats don't require tier
- /v1/tags/:type?
    Get a list of tags or filter them by type; Side, Trait, Team, Role or Flavor
