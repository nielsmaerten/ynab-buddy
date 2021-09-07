# Our 3 test banks (explained)

## BankOne
- Exports every account using a unique filename containing
  - the bank name
  - the ID of the account
  - a unique identifier per export
- We have 2 files from BankOne, each belonging to the same account

## BankTwo
- Also puts the bank name in their export statements
- Does not add a unique id per export, but
- does add an identifier for the account the export belongs to

## BankThree
- Does not use unique filenames, just 'export.csv'
- Has to be organized into folders by the user themselves to indicate the account
- Probably your grandma's bank