// Review data for TripAdvisor and Viator
export interface Review {
    id: string;
    platform: 'tripadvisor' | 'viator';
    author: string;
    rating: number;
    date: string;
    title?: string;
    text: string;
    location?: string;
}

export interface PlatformData {
    name: string;
    overallRating: number;
    totalReviews: number;
    url: string;
    icon: string;
}

export const platformData: Record<'tripadvisor' | 'viator', PlatformData> = {
    tripadvisor: {
        name: 'TripAdvisor',
        overallRating: 5.0,
        totalReviews: 45,
        url: 'https://www.tripadvisor.ca/AttractionProductReview-g154976-d28767577-Peggy_s_Cove_Lunenburg_and_Titanic_Cemetery_Full_Day_Tour-Halifax_Halifax_Regional.html',
        icon: '🏆',
    },
    viator: {
        name: 'Viator',
        overallRating: 4.9,
        totalReviews: 82,
        url: 'https://www.viator.com/en-CA/tours/Halifax/Full-Day-Tour-to-Peggys-Cove-Lunenburg-and-Titanic-Cemetery/d4403-5516816P1',
        icon: '⭐',
    },
};

export const reviews: Review[] = [
    {
        id: 'ta-1',
        platform: 'tripadvisor',
        author: 'Sarah M.',
        rating: 5,
        date: '2024-01-15',
        title: 'Absolutely Amazing Tour!',
        text: 'Our family had the most incredible experience with Alpha Travel & Tours. The guide was knowledgeable and friendly, and the stops at Peggy\'s Cove and Lunenburg were breathtaking. Highly recommend!',
        location: 'Toronto, Canada',
    },
    {
        id: 'ta-2',
        platform: 'tripadvisor',
        author: 'James T.',
        rating: 5,
        date: '2024-01-10',
        title: 'Best Tour in Nova Scotia',
        text: 'We booked the full-day tour and it exceeded all expectations. The scenery was stunning, and our guide made the history come alive. Perfect timing at each stop. Worth every penny!',
        location: 'Boston, USA',
    },
    {
        id: 'ta-3',
        platform: 'tripadvisor',
        author: 'Emily R.',
        rating: 5,
        date: '2024-01-05',
        title: 'Professional and Memorable',
        text: 'Alpha Travel & Tours provided exceptional service from start to finish. The vehicle was comfortable, the driver was punctual and professional, and we saw so much in one day. Can\'t wait to book again!',
        location: 'Montreal, Canada',
    },
    {
        id: 'v-1',
        platform: 'viator',
        author: 'Michael P.',
        rating: 5,
        date: '2024-01-20',
        title: 'Outstanding Experience',
        text: 'Booked this tour for our cruise port day in Halifax. Everything was perfectly organized, and we got to see all the highlights. The Titanic Cemetery was particularly moving. Five stars all around!',
        location: 'New York, USA',
    },
    {
        id: 'v-2',
        platform: 'viator',
        author: 'Linda K.',
        rating: 5,
        date: '2024-01-12',
        title: 'Highly Recommend!',
        text: 'This was the highlight of our Nova Scotia trip. Our guide was fantastic - friendly, informative, and made sure everyone was comfortable. The stops were well-paced and we had plenty of time for photos.',
        location: 'London, UK',
    },
    {
        id: 'v-3',
        platform: 'viator',
        author: 'Robert D.',
        rating: 5,
        date: '2024-01-08',
        title: 'Excellent Tour Company',
        text: 'We\'ve taken many tours around the world, and Alpha Travel & Tours stands out. Great communication, reliable service, and a genuine passion for showing off the beauty of Nova Scotia. Will definitely use them again!',
        location: 'Sydney, Australia',
    },
    {
        id: 'ta-4',
        platform: 'tripadvisor',
        author: 'Patricia W.',
        rating: 5,
        date: '2023-12-28',
        title: 'Perfect Day Trip!',
        text: 'My husband and I booked the Peggy\'s Cove tour and it was absolutely perfect. The lighthouse is iconic, Lunenburg is charming, and the history at the Titanic Cemetery was fascinating. Great value!',
        location: 'Halifax, Canada',
    },
    {
        id: 'v-4',
        platform: 'viator',
        author: 'David S.',
        rating: 5,
        date: '2023-12-22',
        title: 'A Must-Do in Halifax!',
        text: 'If you\'re in Halifax, this tour is a must. Alpha Travel made everything so easy. Pickup was on time, the vehicle was clean and comfortable, and the entire experience was first-class.',
        location: 'Chicago, USA',
    },
    {
        id: 'ta-5',
        platform: 'tripadvisor',
        author: 'Jennifer L.',
        rating: 5,
        date: '2023-12-15',
        title: 'Wonderful Experience',
        text: 'From booking to drop-off, everything was seamless. The tour hit all the major sights and our guide shared wonderful stories about Nova Scotia\'s history and culture. Couldn\'t have asked for more!',
        location: 'Vancouver, Canada',
    },
];
