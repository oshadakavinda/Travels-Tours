// Basic function for removing HTML tags (for other text fields)
const stripHtmlTags = (text) => {
  if (!text) return '';
  
  return String(text)
    .replace(/<[^>]*>/g, '')       // Remove HTML tags
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();                       // Trim extra whitespace
};/* eslint-disable react/prop-types */

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../images/logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 10,
    borderBottom: '2 solid #E5E7EB',
    paddingBottom: 8,
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain', // Maintains aspect ratio
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#374151',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 20,
  },
  infoItem: {
    flex: 1,
  },
  bookingSection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  bookingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bookingItem: {
    width: '48%',
  },
  descriptionSection: {
    marginBottom: 12,
  },
  timelineSection: {
    marginTop: 12,
    flex: 1,
  },
  timelineDayWrapper: {
    marginBottom: 12, // More compact spacing
  },
  timelineItem: {
    paddingLeft: 15,
    borderLeft: '2 solid #3B82F6',
    paddingBottom: 8, // Reduced for space efficiency
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3, // Reduced 
    color: '#2563EB',
  },
  timelineSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 3, // Reduced
  },
  activityList: {
    marginLeft: 10,
  },
  activityItem: {
    fontSize: 11,
    marginBottom: 2, // Reduced
    color: '#4B5563',
  },
  noActivities: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  pageFooter: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
    paddingTop: 8,
    borderTop: '1 solid #E5E7EB',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 25, // Minimal padding for footer
  },
  pageHeader: {
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1 solid #E5E7EB',
  },
  lastItemOnPage: {
    marginBottom: 0,
  }
});

// Helper function to convert HTML to plain text using DOM parser
const htmlToText = (html) => {
  if (!html) return '';
  
  // For server-side rendering (Node.js environment)
  if (typeof document === 'undefined') {
    // Simple fallback if running server-side
    return String(html)
      .replace(/<[^>]+>/g, '') // Strip HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  try {
    // For client-side rendering (browser environment)
    // Create a temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get the text content
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up weird characters and extra spaces
    return textContent
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
      .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes
      .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  } catch (error) {
    // Fallback in case of error
    return String(html)
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }
};

const TourPDFDocument = ({ tour, destinationList, bookingData }) => {
  const { title, days, destinations } = tour || {};
  
  // Use the HTML to text converter for the description
  const cleanDescription = htmlToText(tour?.desc || '');
  
  const idStrings = Array.isArray(destinations)
    ? destinations.map((item) => item._id)
    : [];

  const filteredDestinations = idStrings
    .map((id) => destinationList.find((dest) => dest._id === id))
    .filter(Boolean);

  const timelineDestinations =
    filteredDestinations.length > 0 ? filteredDestinations : destinationList || [];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate first page allocation based on content needs
  // We estimate space consumption and allocate items accordingly
  // Adjust space estimate based on whether booking data is present
  const contentSizeEstimate = bookingData ? 200 : 100; // Less space used when no booking data
  const timelineItemHeight = 95; // Estimated average height of a timeline item in pixels
  const pageHeight = 750; // Estimated usable height of A4 page in pixels after margins
  
  // Calculate how many destination items we can fit on first page
  const remainingFirstPageSpace = pageHeight - contentSizeEstimate;
  const firstPageItems = Math.max(1, Math.floor(remainingFirstPageSpace / timelineItemHeight));

  // First page destinations
  const firstPageContent = timelineDestinations.slice(0, firstPageItems);
  
  // Remaining destinations
  const remainingDestinations = timelineDestinations.slice(firstPageItems);
  
  // Calculate how many items can fit on subsequent pages
  const subsequentPageContentSize = 50; // Header size estimate
  const itemsPerSubsequentPage = Math.floor((pageHeight - subsequentPageContentSize) / timelineItemHeight);

  // Create pages with maximum items per page
  const subsequentPages = [];
  for (let i = 0; i < remainingDestinations.length; i += itemsPerSubsequentPage) {
    subsequentPages.push(remainingDestinations.slice(i, i + itemsPerSubsequentPage));
  }

  const renderTimelineDay = (destination, index, totalDestinations, isLastOnPage) => {
    const travelRoute = index === 0
      ? `Airport - ${destination.destinationName}`
      : index === totalDestinations - 1
      ? `${destination.destinationName} - Airport`
      : `${timelineDestinations[index - 1]?.destinationName || 'Previous Location'} - ${destination.destinationName}`;

    return (
      <View 
        key={destination._id} 
        style={[
          styles.timelineDayWrapper,
          isLastOnPage && styles.lastItemOnPage // No bottom margin for last item
        ]}
      >
        <View style={styles.timelineItem}>
          <Text style={styles.timelineTitle}>
            Day {index + 1} - {travelRoute}
          </Text>
          <Text style={styles.timelineSubtitle}>
            Activities in {destination.destinationName}
          </Text>
          <View style={styles.activityList}>
            {destination.activities && destination.activities.length > 0 ? (
              destination.activities.map((activity, idx) => (
                <Text key={idx} style={styles.activityItem}>
                  • {htmlToText(activity)}
                </Text>
              ))
            ) : (
              <Text style={styles.noActivities}>
                Activities to be confirmed
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Document>
      {/* First page with header info */}
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Title and Basic Info Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src={logo}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>{htmlToText(title)}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Duration: </Text>
                {days} Days
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Destinations: </Text>
                {timelineDestinations.length -1 || 0} locations
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details Section - Only render if bookingData exists */}
        {bookingData && (
          <View style={styles.bookingSection}>
            <Text style={styles.subtitle}>Booking Details</Text>
            <View style={styles.bookingGrid}>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Guest Name: </Text>
                  {bookingData.fullName}
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Email: </Text>
                  {bookingData.email}
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Contact: </Text>
                  {bookingData.phone}
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Travel Date: </Text>
                  {formatDate(bookingData.bookAt)}
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Group Size: </Text>
                  {bookingData.guestSize} persons
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Transport: </Text>
                  {bookingData.vehicleType} (x{bookingData.vehicles})
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Accommodation: </Text>
                  {bookingData.accommodationType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Rooms: </Text>
                  {bookingData.bedrooms} bedroom(s)
                </Text>
              </View>
            </View>
            {bookingData.preferences && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.boldText}>Special Requests:</Text>
                <Text style={styles.text}>{htmlToText(bookingData.preferences)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.subtitle}>Tour Description</Text>
          <Text style={styles.text}>
            {/* Apply a direct text-only rendering approach */}
            {cleanDescription || "Tour description not available."}
          </Text>
        </View>

        {/* First page timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.subtitle}>Travel Itinerary</Text>
          <View style={styles.timelineContent}>
            {firstPageContent.map((destination, i) => 
              renderTimelineDay(
                destination, 
                i, 
                timelineDestinations.length,
                i === firstPageContent.length - 1
              )
            )}
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text>Document generated on {formatDate(new Date().toISOString())}</Text>
        </View>
      </Page>

      {/* Subsequent pages with maximum timeline items */}
      {subsequentPages.map((pageDestinations, pageIndex) => (
        <Page key={pageIndex + 1} size="A4" style={styles.page} wrap={true}>
          {/* Add page header for continuity */}
          <View style={styles.pageHeader}>
            <Text style={styles.subtitle}>Travel Itinerary (Continued)</Text>
          </View>
          
          <View style={styles.timelineSection}>
            <View style={styles.timelineContent}>
              {pageDestinations.map((destination, i) => 
                renderTimelineDay(
                  destination,
                  firstPageItems + (pageIndex * itemsPerSubsequentPage) + i,
                  timelineDestinations.length,
                  i === pageDestinations.length - 1
                )
              )}
            </View>
          </View>
          
          <View style={styles.pageFooter}>
            <Text>Document generated on {formatDate(new Date().toISOString())} - Page {pageIndex + 2}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TourPDFDocument;