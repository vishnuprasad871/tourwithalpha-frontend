export interface GoogleReview {
    id: string;
    author: string;
    badge?: string;
    rating: number;
    date: string;
    text: string;
    featured?: boolean;
}

export const googleReviews: GoogleReview[] = [
    {
        id: 'g-1',
        author: 'Tina Jordan',
        badge: 'Local Guide · 22 reviews',
        rating: 5,
        date: '2025-10-01',
        featured: true,
        text: 'We just got back from an amazing trip to Canada. One of the highlights was our day with Arjun at Alpha Travel & Tours. He was super easy to communicate with in making the booking, was very flexible as our day of arrival changed, and provided us with a great day in Halifax. Arjun was a wealth of information during our tour — providing history as well as fun facts. We toured Halifax, the Titanic Cemetery, the quaint town of Lunenburg and Peggy\'s Cove. It was a full day, but Arjun kept us on schedule and made the day fly by with his passion and excitement for the area. I did A LOT of research on tours before booking Alpha Travel & Tours. So glad we went with this company. Save yourself the time of researching (I did it for you!) and book this tour! You won\'t be sorry!',
    },
    {
        id: 'g-2',
        author: 'Christopher Garin',
        badge: '9 reviews · 5 photos',
        rating: 5,
        date: '2025-09-01',
        text: 'We had the 7 hour tour of Peggy\'s Cove, Lunenburg, and the Titanic Cemetery. It was led by Arjun who was immensely knowledgeable on Nova Scotian history and was consistently able to answer all of our questions. He was a fantastic guide and we will definitely be recommending him to any of our friends and family that will be visiting. 10/10 tour and guide.',
    },
    {
        id: 'g-3',
        author: 'Judy Veitch',
        badge: '5 reviews',
        rating: 5,
        date: '2025-04-01',
        text: 'A wonderful experience from pick-up to drop-off. Communication prior to the day was excellent. We were lucky enough to have a very small group, so our driver/guide, Arjun, was able to chat and answer questions easily. The tour itself was comprehensive — Peggy\'s Cove is a natural wonder, Lunenburg an area of amazing & colourful construction, and then the visit to the Titanic graves was very sad and sobering. Thoroughly recommend this tour.',
    },
    {
        id: 'g-4',
        author: 'Abin Thomas',
        badge: 'Local Guide · 11 reviews',
        rating: 5,
        date: '2025-04-01',
        text: 'I recently booked a trip to the Cabot Trail through Alpha Travel & Tours, and the experience was excellent! The itinerary was well-organized, and the breathtaking views of the trail made it truly unforgettable. A special shoutout to Arjun, who was incredibly helpful throughout the process — from answering my questions to ensuring all the arrangements were seamless. I highly recommend Alpha Travel & Tours for anyone planning their next adventure!',
    },
    {
        id: 'g-5',
        author: 'Anandaraman Chappuzhasseril Baiju',
        badge: '4 reviews',
        rating: 5,
        date: '2025-04-01',
        text: 'I had a great experience with Alpha Travel & Tours! I joined their Cabot Trail tour and the Peggy\'s Cove Sunset tour, and both were amazing. The Cabot Trail was stunning, especially with the fall colors, and the guide was friendly and knowledgeable. The Peggy\'s Cove Sunset tour was beautiful, and the sunset over the lighthouse was unforgettable. Everything was well-organized. Highly recommend!',
    },
    {
        id: 'g-6',
        author: 'max saneesh',
        badge: 'Local Guide · 40 reviews',
        rating: 5,
        date: '2025-04-01',
        text: 'I recently had the pleasure of booking a trip with Alpha Travel and Tours, and I am thoroughly impressed by their outstanding service. From start to finish, their coordination was flawless, ensuring every detail of the journey was perfectly aligned with my needs. The team displayed exceptional professionalism, always available to answer questions and provide support. They went above and beyond to make the trip smooth and enjoyable. I highly recommend them for anyone looking for a well-organized and stress-free travel experience!',
    },
    {
        id: 'g-7',
        author: 'Aline Atallah',
        badge: '1 review',
        rating: 5,
        date: '2025-04-01',
        text: 'This was the highlight of my trip! Arjun was very kind, patient, and punctual. The views were breathtaking and the information that Arjun provided was very helpful. Would highly recommend!',
    },
    {
        id: 'g-8',
        author: 'mary vogt',
        badge: '1 review',
        rating: 5,
        date: '2025-05-01',
        text: 'Alpha Tours is the one to contact in Halifax. Great tour of Peggy\'s Cove, Lunenburg, and the Titanic Cemetery. He was prompt, very knowledgeable, organized, willing to help with any problems. In general a five out of five for the best!',
    },
    {
        id: 'g-9',
        author: 'SuMin R PeTer',
        badge: '3 reviews · 10 photos',
        rating: 5,
        date: '2025-10-01',
        text: 'Great experience with Alpha Tours and Travel, Halifax! Professional, helpful, and made my travel plans easy and stress-free. Highly recommended!',
    },
    {
        id: 'g-10',
        author: 'ani k',
        badge: 'Local Guide · 10 reviews',
        rating: 5,
        date: '2025-04-01',
        text: 'Recently, we booked a trip to Cape Breton with Alpha Travels. We enjoyed our trip to the fullest. Arjun is a very polite, humble, and punctual guy. He took us to the right view spots and we were able to cover most of it. His expertise travel knowledge helped us to enjoy many places in a single day tour. We really felt we made a good decision by selecting this tour service.',
    },
];
