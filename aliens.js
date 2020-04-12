const userLocale = getUserLocale()

const dictionary = {
  'ja-JP': {
    Joined: '入社',
  },
  'de-DE': {
    Joined: 'Mitglied seit',
  }
}


$( document ).ready( () => {
  translate()
  utcToUserTime()
  lazyLoadImages()
} )


function getUserLocale () {
  if ( navigator.languages != undefined ) {
    return navigator.languages[ 0 ]
  } else if ( navigator !== undefined )  {
    return navigator.language.split( ',' )[ 0 ]
  } else {
    return 'en-US'
  }
}


function utcToUserTime () {
  // only check time tags with the utc class
  for ( const timeElement of $( `#aliens time.utc` ) ) {
    // remove the utc class so that when this function is called in the future
    // already converted times won't be converted again
    timeElement.outerHTML = `<time>${ utcToUserTimeStamp( timeElement.innerHTML ) }</time>`
  }
}


// expects a valid timestamp such as 2020-04-10 13:59:57
function utcToUserTimeStamp ( utcTimeStamp, locale = userLocale ) {
  const now = new Date()

  const diffYear = now.getFullYear() - now.getUTCFullYear()
  const diffMonth = now.getMonth() - now.getUTCMonth()
  const diffDate = now.getDate() - now.getUTCDate()
  const diffHours = now.getHours() - now.getUTCHours()
  const diffMinutes = now.getMinutes() - now.getUTCMinutes()

  const zeroDate = new Date( 0, 0, 0, 0, 0, 0, 0 )
  const utcDiffDate = new Date( diffYear, diffMonth, diffDate, diffHours, diffMinutes, 0, 0 )

  // get the difference from current user time to UTC time in microseconds
  const diffTimeStamp = utcDiffDate.getTime() - zeroDate.getTime()

  const [ dateString, timeString ] = utcTimeStamp.split( ' ' )
  const [ year, month, date ] = dateString.split( '-' )
  const [ hours, minutes ] = timeString.split( ':' )

  const inputDate = new Date( year, month, date, hours, minutes )
  const inputTimeStamp = inputDate.getTime()
  const localTimeStamp = inputTimeStamp + diffTimeStamp
  const outputDate = new Date( localTimeStamp )
  const output = outputDate.toLocaleDateString( locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  } ) + ', ' + outputDate.toLocaleTimeString( locale, {
    hour: 'numeric',
    minute: 'numeric',
  } )

  return output
}


function lazyLoadImages ( opt ) {
  const { logLoaded, maxDelay } = _.defaults( opt || {}, {
    logLoaded: false,
    maxDelay: 0.5,
  } )

  $( '.lazy' ).Lazy( {
    scrollDirection: 'vertical',
    effect: 'fadeIn',
    effectTime: 0, // the timing of this isn't good, so we use our own fade in on elements load below
    imageBase: 'user-images/',
    onError: ( elements ) => console.log( 'Error loading', elements[ 0 ].src ),
    afterLoad: ( elements ) => {
      if ( logLoaded ) console.log( 'Loaded', elements[ 0 ].src )

      if ( elements.hasClass( 'traits' ) ) elements.css( 'display', 'none' )

      if ( elements.hasClass( 'image' ) ) {
        elements.on( 'load', () => {
          const delay = Math.random() * maxDelay
          new TimelineMax( { delay } )
            .fromTo( elements, { css: { opacity: 0 } }, { duration: 0.25, ease: "power4.in", css: { opacity: 0.5 } } )
            .to( elements, { duration: 0.25, ease: "power4.out", css: { opacity: 0.1 } } )
            .to( elements, { duration: 0.5, ease: "bounce.out", css: { opacity: 1 } } )
        } )
      }
    }
  } )
}


function translate () {
  for ( const translateElement of $( `span.localized` ) ) {
    // remove the entire span tag so that when this function is called in the future this can be skipped
    translateElement.outerHTML = localize( translateElement.innerHTML )
  }
}


function localize ( key, locale = userLocale ) {
  if ( dictionary[ locale ] !== undefined ) return dictionary[ locale ][ key ] || key
  return key
}


function showTraits ( id ) {
  $( `#alien${ id } .image:first` ).css( 'display', 'none' )
  $( `#alien${ id } .traits:first` ).css( 'display', 'block' )
}


function hideTraits ( id ) {
  $( `#alien${ id } .image:first` ).css( 'display', 'block' )
  $( `#alien${ id } .traits:first` ).css( 'display', 'none' )
}


function toggleTraits ( id ) {
  if ( $( `#alien${ id } .traits` ).css( 'display' ) === 'none' ) {
    showTraits( id )
  } else {
    hideTraits( id )
  }
}
