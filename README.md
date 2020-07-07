# msfAPI
_API for interacting and retrieving character &amp; gear data for MSF_

__Currently supported endpoints__

- /v1/characters 
    Get a complete list of characters
- /v1/character/:charId
    Get details for a specific character
- /v1/character/tags
    Get the tags for a specific character
- /v1/character/:charId/:tierLevel
    Get gear details for a specific tier level
- /v1/gear/:gearId/:tier?
    Get details about a gear piece, include tier to filter down. 
    Note: After the top level, mats don't require tier
- /v1/tags/:type?
    Get a list of tags or filter them by type; Side, Trait, Team, Role or Flavor
