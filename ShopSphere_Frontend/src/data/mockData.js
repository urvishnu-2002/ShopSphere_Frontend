// Mock data for delivery dashboard
export const mockOrders = [
    {
        id: 'ORD-001',
        userName: 'John Doe',
        deliveryAddress: '123 Main Street, Apartment 4B, New York, NY 10001',
        status: 'confirmed',
        deliveryPersonId: null,
        deliveryPersonName: null,
        items: [
            { name: 'Watch', quantity: 1, price: 120 },
            { name: 'Laptop', quantity: 1, price: 100 }
        ],
        total: 220,
        createdAt: '2026-02-05T10:30:00Z'
    },
    {
        id: 'ORD-002',
        userName: 'Jane Smith',
        deliveryAddress: '456 Oak Avenue, Suite 12, Brooklyn, NY 11201',
        status: 'confirmed',
        deliveryPersonId: null,
        deliveryPersonName: null,
        items: [
            { name: 'Phone', quantity: 2, price: 40 }
        ],
        total: 80,
        createdAt: '2026-02-05T11:00:00Z'
    },
    {
        id: 'ORD-003',
        userName: 'Bob Wilson',
        deliveryAddress: '789 Pine Road, Floor 3, Queens, NY 11375',
        status: 'shipped',
        deliveryPersonId: 'd1',
        deliveryPersonName: 'Mike Driver',
        items: [
            { name: 'Keyboard', quantity: 1, price: 70 },
            { name: 'Mouse', quantity: 1, price: 150 }
        ],
        total: 220,
        createdAt: '2026-02-05T09:15:00Z'
    },
    {
        id: 'ORD-004',
        userName: 'Alice Brown',
        deliveryAddress: '321 Elm Street, Building C, Manhattan, NY 10002',
        status: 'delivered',
        deliveryPersonId: 'd1',
        deliveryPersonName: 'Mike Driver',
        items: [
            { name: 'TV', quantity: 1, price: 80 }
        ],
        total: 80,
        createdAt: '2026-02-04T14:20:00Z'
    },
    {
        id: 'ORD-005',
        userName: 'Charlie Davis',
        deliveryAddress: '555 Maple Lane, Unit 7, Bronx, NY 10451',
        status: 'delivered',
        deliveryPersonId: 'd1',
        deliveryPersonName: 'Mike Driver',
        items: [
            { name: 'Computer', quantity: 1, price: 90 },
            { name: 'Charger', quantity: 2, price: 60 }
        ],
        total: 210,
        createdAt: '2026-02-04T16:45:00Z'
    },
    {
        id: 'ORD-006',
        userName: 'Diana Evans',
        deliveryAddress: '888 Cedar Court, Penthouse, Staten Island, NY 10301',
        status: 'confirmed',
        deliveryPersonId: null,
        deliveryPersonName: null,
        items: [
            { name: 'Remote', quantity: 3, price: 55 }
        ],
        total: 165,
        createdAt: '2026-02-05T12:30:00Z'
    }
];

export const mockDeliveryPerson = {
    id: 'd1',
    name: 'Mike Driver',
    email: 'mike@shopsphere.com',
    phone: '+1 555-123-4567',
    vehicleType: 'Motorcycle',
    rating: 4.8,
    totalDeliveries: 156
};
