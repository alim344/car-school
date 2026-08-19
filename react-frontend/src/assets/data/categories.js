import categoryAM from "../categoryAM.png";  
import categoryA1 from "../categoryA1.jpg"; 
import categoryA2 from "../categoryA2.png";  
import categoryA from "../categoryA.jpg";
import categoryB1 from "../categoryB1.jpg";
import categoryB from "../categoryB.webp";
import categoryBE from "../categoryBE.jpg";
import categoryC1 from "../categoryC1.jpg";
import categoryC1E from "../categoryC1E.jpg";
import categoryC from "../categoryC.jpg";
import categoryCE from "../categoryCE.jpg";
import categoryD1 from "../categoryD1.jpg";
import categoryD1E from "../categoryD1E.jpg";
import categoryD from "../categoryD.jpg";
import categoryDE from "../categoryDE.jpg";
import categoryF from "../categoryF.jpg";
import categoryM from "../categoryM.jpg";

export const categories = [
  {
    id: 'am',
    category: 'Category AM',
    image: categoryAM,
    description: 'Mopeds and light quadricycles for city and short-distance driving.',
    vehicles: '50cc engine, max 45 km/h, weight ≤ 425 kg',
    age: '16 years',
    duration: '15 hours',
    price: '€250',
    group: 'two-wheelers'
  },
  {
    id: 'a1',
    category: 'Category A1',
     image: categoryA1,
    description: 'Light motorcycles perfect for beginners and daily commuting.',
    vehicles: 'Up to 125cc, max 11 kW power output',
    age: '16 years',
    duration: '20 hours',
    price: '€350',
    group: 'two-wheelers'
  },
  {
    id: 'a2',
    category: 'Category A2',
     image: categoryA2,
    description: 'Mid-range motorcycles with increased power for experienced riders.',
    vehicles: 'Up to 35 kW, power/weight ≤ 0.2 kW/kg',
    age: '18 years',
    duration: '25 hours',
    price: '€450',
    group: 'two-wheelers'
  },
  {
    id: 'a',
    category: 'Category A',
     image: categoryA,
    description: 'Unrestricted motorcycles for advanced riders with full privileges.',
    vehicles: 'Any motorcycle with or without sidecar',
    age: '20-21 years',
    duration: '30 hours',
    price: '€550',
    group: 'two-wheelers'
  },

  {
    id: 'b1',
    category: 'Category B1',
     image: categoryB1,
    description: 'Light four-wheeled vehicles (quadricycles) for urban mobility.',
    vehicles: 'Weight ≤ 550 kg, max speed 45-80 km/h',
    age: '16 years',
    duration: '18 hours',
    price: '€300',
    group: 'cars-vans'
  },
  {
    id: 'b',
    category: 'Category B',
     image: categoryB,
    description: 'Standard passenger car license for everyday driving needs.',
    vehicles: 'Up to 3,500 kg, max 8 passenger seats, light trailer ≤ 750 kg',
    age: '18 years',
    duration: '30 hours',
    price: '€500',
    group: 'cars-vans'
  },
  {
    id: 'be',
    category: 'Category BE',
     image: categoryBE,
    description: 'Car license with heavy trailer towing capability.',
    vehicles: 'Trailer > 750 kg, combined weight up to 4,250 kg',
    age: '18 years (with B license)',
    duration: '10 hours',
    price: '€200',
    group: 'cars-vans'
  },

  {
    id: 'c1',
    category: 'Category C1',
     image: categoryC1,
    description: 'Light trucks for commercial and transportation purposes.',
    vehicles: '3.5 - 7.5 tons, light trailer ≤ 750 kg',
    age: '18 years',
    duration: '35 hours',
    price: '€600',
    group: 'trucks'
  },
  {
    id: 'c1e',
    category: 'Category C1E',
     image: categoryC1E,
    description: 'Light truck with heavy trailer for increased load capacity.',
    vehicles: 'C1 vehicle with trailer > 750 kg',
    age: '18 years (with C1 license)',
    duration: '12 hours',
    price: '€250',
    group: 'trucks'
  },
  {
    id: 'c',
    category: 'Category C',
     image: categoryC,
    description: 'Full truck license for professional drivers.',
    vehicles: 'Any vehicle > 3.5 tons, light trailer ≤ 750 kg',
    age: '21 years (or 18 for professional use)',
    duration: '40 hours',
    price: '€750',
    group: 'trucks'
  },
  {
    id: 'ce',
    category: 'Category CE',
     image: categoryCE,
    description: 'Truck with heavy trailer for maximum load capacity.',
    vehicles: 'C category vehicle with trailer > 750 kg',
    age: '21 years (with C license)',
    duration: '15 hours',
    price: '€300',
    group: 'trucks'
  },

  {
    id: 'd1',
    category: 'Category D1',
     image: categoryD1,
    description: 'Minibus license for transport of up to 16 passengers.',
    vehicles: '9-16 passengers, light trailer ≤ 750 kg',
    age: '18 years (professional) / 21 years (non-professional)',
    duration: '35 hours',
    price: '€650',
    group: 'buses'
  },
  {
    id: 'd1e',
    category: 'Category D1E',
     image: categoryD1E,
    description: 'Minibus with heavy trailer for additional luggage capacity.',
    vehicles: 'D1 vehicle with trailer > 750 kg',
    age: '18 years (with D1 license)',
    duration: '12 hours',
    price: '€280',
    group: 'buses'
  },
  {
    id: 'd',
    category: 'Category D',
     image: categoryD,
    description: 'Full bus license for passenger transport over 16 seats.',
    vehicles: 'Any vehicle for > 16 passengers, light trailer ≤ 750 kg',
    age: '24 years (or 20 for professional use)',
    duration: '45 hours',
    price: '€850',
    group: 'buses'
  },
  {
    id: 'de',
    category: 'Category DE',
     image: categoryDE,
    description: 'Bus with heavy trailer for maximum passenger capacity.',
    vehicles: 'D category vehicle with trailer > 750 kg',
    age: '24 years (with D license)',
    duration: '15 hours',
    price: '€350',
    group: 'buses'
  },


  {
    id: 'f',
    category: 'Category F',
     image: categoryF,
    description: 'Agricultural and forestry tractor license.',
    vehicles: 'Agricultural/forestry tractors',
    age: '16 years',
    duration: '20 hours',
    price: '€350',
    group: 'special'
  },
  {
    id: 'm',
    category: 'Category M',
     image: categoryM,
    description: 'Moped license for low-speed two-wheeled vehicles.',
    vehicles: 'Small mopeds, max speed 45 km/h',
    age: '14-15 years',
    duration: '10 hours',
    price: '€150',
    group: 'special'
  }
];

export const getGroups = () => {
  return [...new Set(categories.map(cat => cat.group))];
};

export const groupNames = {
  'two-wheelers': 'Two-Wheelers',
  'cars-vans': 'Cars & Vans',
  'trucks': 'Trucks',
  'buses': 'Buses',
  'special': 'Special Vehicles'
};