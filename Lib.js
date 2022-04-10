module.exports = class Lib {
  /*
    Converts integers to string and appends leading zeros.
    So getLeadingZero(5, 10) becomes "0000000005".
    Is used for css selector "pve_action__01" until e.g. "pve_action__36".
  */
  static getLeadingZero(number, length) {
    const numberString = number.toString()
    if (numberString.length >= length) return numberString
    else return '0'.repeat(length - numberString.length) + numberString
  }

  /*
    Selects all actions of a job
  */
  static getActions(doc) {
    const actions = []

    // Getting the table with job actions in it
    const table = doc.querySelector(
      '.job__content > div:nth-child(3) > table:nth-child(3) > tbody:nth-child(3)'
    )

    // From this table we select all childs with an ID starting with "pve_action" and count them.
    // This is used for the for-loop, that automatically goes through all actions.
    const spellCount = table.querySelectorAll(
      ":scope > tr[id^='pve_action']"
    ).length

    // Go through all actions.
    for (let i = 1; i <= spellCount; i++) {
      // In order to prevent typing this on every selector, I put this here.
      // It is just a string for the css selector. Points at the correct child with ID "pve_action__XX".
      const root = `tr[id^='pve_action__${this.getLeadingZero(i, 2)}'] > `

      // Grab the img element for the icon and gets the link (src).
      const icon = table.querySelector(
        root +
          'td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > img:nth-child(1)'
      )?.attributes['src']?.value

      // Grab the name. Sometimes there are a bunch of \n\n\n\t\t\t behind the name, so we remove that with split.
      const name = table
        .querySelector(
          root + 'td:nth-child(1) > div:nth-child(1) > p:nth-child(2)'
        )
        ?.textContent.trim()
        .split('\n')
        ?.at(0)

      // Getting the level string and remove the "Lv. " by selecting only numbers via regex.
      const level = parseInt(
        table
          .querySelector(
            root + 'td:nth-child(2) > div:nth-child(1) > p:nth-child(2)'
          )
          ?.textContent.trim()
          .match(/\d+/g)?.[0]
      )

      // Getting simplet the strings for the following
      const type = table
        .querySelector(root + 'td:nth-child(3)')
        ?.textContent.trim()

      const cast = table
        .querySelector(root + 'td:nth-child(4)')
        ?.textContent.trim()

      const recast = table
        .querySelector(root + 'td:nth-child(5)')
        ?.textContent.trim()

      const mpCost = table
        .querySelector(root + 'td:nth-child(6)')
        ?.textContent.trim()

      // Range:
      // Get the icon from the img element
      const rangeIcon = table.querySelector(
        root + 'td:nth-child(7) > img:nth-child(1)'
      )?.attributes['src']?.value

      // Get the string for the actual range (This includes the "y" for yalms. So not an integer).
      const rangeValue = table
        .querySelector(root + 'td:nth-child(7)')
        ?.textContent.trim()
        .split('\n')
        ?.at(0)

      // Bundle it
      const range = {
        rangeIcon,
        rangeValue
      }

      // Same as range but for radius
      const radiusIcon = table.querySelector(
        root + 'td:nth-child(7) > img:nth-child(3)'
      )?.attributes['src']?.value

      const radiusValue = table
        .querySelector(root + 'td:nth-child(7)')
        ?.textContent.trim()
        .split('\t')
        ?.at(-1)

      const radius = {
        radiusIcon,
        radiusValue
      }

      // Get the description of an action and doing some formatting.
      const effect = table
        .querySelector(root + 'td:nth-child(8)')
        ?.textContent.trim()
        .replaceAll('.', '. ')
        .replaceAll('\n', '')
        .replaceAll('\t', '')
        .trim()

      // Add all the info as one object to the actions array.
      actions.push({
        icon,
        name,
        level,
        type,
        cast,
        recast,
        mpCost,
        range,
        radius,
        effect
      })
    }

    return actions
  }
}
