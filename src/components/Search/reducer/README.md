# `Search`

## Tests

### Criteria

- States
  - Search string
    - Empty
    - Full
  - Search status
    - Idle
    - Loading
    - Error
  - Result
    - Idle
      - Initial
      - Empty
      - Items
      - Error
    - Loading
      - Loading
      - Dim/Blocked
- Actions/Events
  - Query changes
    - Empty
    - Full
  - Debounce timeout
    - Empty
    - Full
  - Response: success
    - No result
    - 3 results
  - Response: error
    - Inside Promise
    - `.then(() => { throw new Error() })`
