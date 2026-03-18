// Review data for Viator
export interface Review {
    id: string;
    platform: 'viator';
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

export const platformData: Record<'viator', PlatformData> = {
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
        id: 'v-4',
        platform: 'viator',
        author: 'David S.',
        rating: 5,
        date: '2023-12-22',
        title: 'A Must-Do in Halifax!',
        text: 'If you\'re in Halifax, this tour is a must. Alpha Travel made everything so easy. Pickup was on time, the vehicle was clean and comfortable, and the entire experience was first-class.',
        location: 'Chicago, USA',
    },
];
