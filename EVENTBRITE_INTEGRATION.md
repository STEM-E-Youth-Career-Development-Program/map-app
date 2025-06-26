# Eventbrite Integration for MapSTEM

This document explains how the Eventbrite API integration works in the MapSTEM application.

## Overview

The MapSTEM app now automatically fetches relevant STEM events from Eventbrite and displays them alongside your own events. This provides users with a much larger pool of educational opportunities to discover.

## Features

### Automatic Event Discovery

- Fetches STEM-related events from Eventbrite using keyword filtering
- Searches within 100km of user's location
- Filters events by STEM categories and keywords
- Updates automatically every 6 hours

### Smart Filtering

Events are filtered using these STEM keywords:

- Science, Technology, Engineering, Math, Mathematics
- STEM, STEAM, Coding, Programming, Robotics
- AI, Machine Learning, Data Science, Computer Science
- Biotech, Chemistry, Physics, Biology, Astronomy
- And many more...

### Event Processing

- Automatically determines STEM subject categories
- Estimates grade level and age group from event descriptions
- Detects virtual vs. onsite events
- Formats cost, location, and timing information
- Prevents duplicate events

## Configuration

### Environment Variables

```
EVENTBRITE_API_KEY=ZCMCQB6JRUBO2IOB6G
EVENTBRITE_PRIVATE_TOKEN=6BV2HHUTQA2WDN5OGAXF
ENABLE_EVENTBRITE_INTEGRATION=true
EVENTBRITE_CACHE_DURATION=21600000
```

### User Settings

Users can control Eventbrite integration through the Settings screen:

- **Enable/Disable Eventbrite Events**: Toggle inclusion of Eventbrite events
- **Auto Refresh**: Automatic syncing every 6 hours
- **Manual Sync**: Force immediate sync with Eventbrite
- **Cache Management**: Clear cached data

## API Usage

### Eventbrite API Endpoints

- **Search Events**: `GET /v3/events/search/`
- **Authentication**: Bearer token authentication
- **Rate Limits**: Respects Eventbrite's rate limiting

### Request Parameters

```javascript
{
  token: EVENTBRITE_PRIVATE_TOKEN,
  expand: 'venue,organizer,category,subcategory,format,ticket_availability',
  order_by: 'start_asc',
  start_date.range_start: startDate,
  start_date.range_end: endDate,
  page_size: '100',
  status: 'live',
  location.latitude: userLatitude,
  location.longitude: userLongitude,
  location.within: '100km',
  q: 'science OR technology OR engineering OR math...'
}
```

## Data Flow

1. **Initial Load**: App fetches both MapSTEM API events and Eventbrite events
2. **Caching**: Events cached locally for 6 hours (Eventbrite) and 24 hours (MapSTEM)
3. **Filtering**: Events filtered by location, search terms, and user preferences
4. **Display**: Combined events shown on map and in list views
5. **Sync**: Background sync manager updates Eventbrite events automatically

## User Experience

### Visual Indicators

- Eventbrite events marked with orange "Eventbrite" or "EB" tags
- Clear distinction between MapSTEM and Eventbrite events
- Consistent styling and information display

### Event Details

Eventbrite events include:

- Event name, description, and image
- Location and virtual/onsite designation
- Cost information (free or paid)
- STEM subject categorization
- Estimated grade level and age group
- Direct link to Eventbrite for registration

## Implementation Files

### Core Integration

- `app/utils/eventbriteApi.js`: Main API integration and event formatting
- `app/utils/eventSyncManager.js`: Background sync management
- `app/utils/data.js`: Updated to combine MapSTEM and Eventbrite events

### UI Components

- `app/components/SettingsModal.js`: User settings for Eventbrite integration
- `app/components/Event.js`: Updated to show Eventbrite source tags
- `app/components/MapCards.js`: Updated to show Eventbrite indicators

### Configuration

- `.env`: Environment variables for API keys and settings
- `App.js`: Sync manager initialization

## Performance Considerations

### Caching Strategy

- Eventbrite events cached for 6 hours
- MapSTEM events cached for 24 hours
- Cache invalidation on settings changes
- Graceful fallback if API unavailable

### Network Optimization

- Batch requests to minimize API calls
- Debounced search queries
- Background sync to avoid blocking UI
- Error handling and retry logic

## Error Handling

### API Failures

- Graceful degradation when Eventbrite API unavailable
- Fallback to cached data when possible
- User notification for sync failures
- Automatic retry with exponential backoff

### Data Validation

- Validates event data before processing
- Handles missing or malformed event information
- Filters out non-STEM events effectively
- Prevents duplicate events in feed

## Security

### API Key Management

- Keys stored in environment variables
- Not exposed in client-side code
- Secure token-based authentication
- Rate limiting compliance

### Data Privacy

- No user data sent to Eventbrite
- Location data used only for event search
- Cached data stored locally only
- Optional integration (user can disable)

## Future Enhancements

### Potential Improvements

- More sophisticated STEM classification using ML
- User preference learning for event recommendations
- Integration with additional event platforms
- Advanced filtering by organizer reputation
- Notification system for new relevant events

### Scalability

- Database integration for better caching
- Push notification service
- Analytics for event engagement
- Admin dashboard for monitoring API usage

## Troubleshooting

### Common Issues

1. **No Eventbrite events showing**: Check internet connection and API keys
2. **Outdated events**: Clear cache or force manual sync
3. **Too many irrelevant events**: Adjust STEM keyword filtering
4. **Performance issues**: Check cache settings and sync frequency

### Debug Information

- Enable logging in development mode
- Check sync manager status in settings
- Monitor API response times and errors
- Validate event data structure

## Support

For issues with Eventbrite integration:

1. Check the Settings screen for sync status
2. Try manual sync to test connectivity
3. Clear cache if data seems stale
4. Check logs for API errors
5. Verify API keys are correctly configured

The integration is designed to be robust and user-friendly, providing seamless access to a wealth of STEM educational opportunities through the Eventbrite platform.
