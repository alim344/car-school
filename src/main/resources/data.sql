INSERT INTO route (name, description, path_geo_json) VALUES
-- 1. Liman & Bulevar Oslobođenja (Poligon to Most Slobode)
('Poligon Most Slobode - Liman 3 Loop',
 'Starting from the parking poligon near Sunčani Kej, heading along Bulevar Cara Lazara, down Bulevar Despota Stefana and back via Most Slobode junction.',
 '{"type":"LineString","coordinates":[[19.8512,45.2395],[19.8450,45.2410],[19.8410,45.2435],[19.8360,45.2380],[19.8430,45.2350],[19.8512,45.2395]]}'),

-- 2. Bulevar Evrope & Detelinara
('Bulevar Evrope Straight & Turning Exercise',
 'Multi-lane boulevard driving focusing on lane changes, traffic lights, and roundabouts near Detelinara.',
 '{"type":"LineString","coordinates":[[19.8120,45.2510],[19.8145,45.2585],[19.8170,45.2660],[19.8250,45.2640],[19.8220,45.2560]]}'),

-- 3. Novo Naselje Residential Zone
('Novo Naselje - Parallel Parking & Pedestrian Zones',
 'Focus on 30 km/h zones, right-of-way rules without traffic signals, and parallel parking along Bulevar Jovana Dučića.',
 '{"type":"LineString","coordinates":[[19.7950,45.2520],[19.7990,45.2545],[19.8050,45.2510],[19.8080,45.2560],[19.7980,45.2580]]}'),

-- 4. Petrovaradin Fortress & Kamenički Put
('Petrovaradin - Varadin Bridge to Fortress Incline',
 'Crossing Varadinski Most, navigating narrow streets in Stari Majur, and practicing hill starts near the Fortress.',
 '{"type":"LineString","coordinates":[[19.8580,45.2540],[19.8630,45.2530],[19.8690,45.2515],[19.8730,45.2480],[19.8680,45.2450]]}'),

-- 5. Sajmište & Subotički Bulevar
('Sajmište - Hospital Zone & Futoška Intersection',
 'Complex light signals near Klinički Centar Vojvodine and heavy urban traffic management on Futoška Ulica.',
 '{"type":"LineString","coordinates":[[19.8260,45.2490],[19.8310,45.2520],[19.8250,45.2550],[19.8190,45.2525],[19.8260,45.2490]]}'),

-- 6. Grbavica Narrow Streets
('Grbavica - One-Way Street Navigation',
 'Tight spatial maneuvering in Puškinova, Miše Dimitrijevića, and Danila Kiša streets with heavy street parking.',
 '{"type":"LineString","coordinates":[[19.8350,45.2450],[19.8390,45.2470],[19.8330,45.2485],[19.8300,45.2460],[19.8350,45.2450]]}'),

-- 7. Podbara & Almaški Kraj
('Podbara - Historic District Rules',
 'Driving through narrow historic cobbled roads, low visibility corners, and yield-to-right rules near Gundulićeva.',
 '{"type":"LineString","coordinates":[[19.8480,45.2610],[19.8520,45.2635],[19.8560,45.2600],[19.8510,45.2580],[19.8480,45.2610]]}'),

-- 8. Rotkvarija & Train Station
('Železnička Stanica Roundabout & Bulevar Jaše Tomića',
 'Heavy public transport interaction near the bus/train station, large roundabouts, and pedestrian crosswalks.',
 '{"type":"LineString","coordinates":[[19.8290,45.2650],[19.8330,45.2670],[19.8410,45.2630],[19.8380,45.2590],[19.8290,45.2650]]}'),

-- 9. Sremska Kamenica Cross-River Path
('Most Slobode to Sremska Kamenica Center',
 'Suburban arterial road driving across Most Slobode into Sremska Kamenica, testing higher speed limit transitions.',
 '{"type":"LineString","coordinates":[[19.8450,45.2350],[19.8480,45.2280],[19.8450,45.2220],[19.8410,45.2250],[19.8450,45.2350]]}'),

-- 10. Salajka Industrial Approach
('Salajka - Partizanska Commercial Zone',
 'Industrial traffic practice involving delivery trucks, wide turns, and railway crossings near Partizanska.',
 '{"type":"LineString","coordinates":[[19.8380,45.2680],[19.8450,45.2710],[19.8530,45.2690],[19.8480,45.2650],[19.8380,45.2680]]}'),

-- 11. Telep - Southern Loop
('Telep - Heroja Pinkija Residential Route',
 'Mixing broad avenues like Bulevar Patrijarha Pavla with narrow suburban streets in Telep.',
 '{"type":"LineString","coordinates":[[19.8050,45.2420],[19.8150,45.2440],[19.8180,45.2390],[19.8080,45.2370],[19.8050,45.2420]]}'),

-- 12. Klisa - Temerinski Put Outbound
('Klisa - Temerinska Arterial Route',
 'High-volume lane selection, traffic light timing, and dual-carriageway driving towards Klisa.',
 '{"type":"LineString","coordinates":[[19.8450,45.2680],[19.8480,45.2750],[19.8510,45.2830],[19.8440,45.2810],[19.8450,45.2680]]}'),

-- 13. University Campus Area
('Univerzitetski Grad - Campus & Sunčani Kej',
 'Low-speed maneuvering near university buildings, high pedestrian density, and cyclists along Dr Zorana Đinđića.',
 '{"type":"LineString","coordinates":[[19.8520,45.2460],[19.8560,45.2480],[19.8510,45.2510],[19.8460,45.2490],[19.8520,45.2460]]}'),

-- 14. Žeželj Bridge & Mišeluk Connection
('Žeželj Most - Petrovaradin Bypass',
 'Bridge crossing, lane merging at elevated highway ramps, and speed control along Reljkovićeva.',
 '{"type":"LineString","coordinates":[[19.8610,45.2620],[19.8660,45.2590],[19.8720,45.2550],[19.8680,45.2520],[19.8610,45.2620]]}'),

-- 15. BIG Shopping Center & Industrial Zone North
('Industrijska Zona Sever - Mall Parking & Roundabouts',
 'Navigating large shopping park entrances, double-lane roundabouts, and heavy retail traffic.',
 '{"type":"LineString","coordinates":[[19.8280,45.2730],[19.8320,45.2780],[19.8390,45.2760],[19.8350,45.2710],[19.8280,45.2730]]}'),

-- 16. Bulevar Oslobođenja - Full Corridor Test
('Bulevar Oslobođenja Main Axis',
 'Testing multi-intersection signaling, bus lane awareness, and left turns along the central city artery.',
 '{"type":"LineString","coordinates":[[19.8300,45.2660],[19.8330,45.2600],[19.8380,45.2500],[19.8440,45.2420],[19.8300,45.2660]]}'),

-- 17. Adice Outer Ring
('Adice Suburban Outer Test Route',
 'Focus on un-signaled T-intersections, narrow roadway yield situations, and reverse entry turnarounds.',
 '{"type":"LineString","coordinates":[[19.7820,45.2410],[19.7880,45.2440],[19.7920,45.2390],[19.7850,45.2360],[19.7820,45.2410]]}'),

-- 18. Futoški Put Outbound
('Futoški Put - Veternik Boundary Route',
 'Straight arterial driving with high-speed transitions (50 to 60+ km/h), traffic light positioning, and U-turns.',
 '{"type":"LineString","coordinates":[[19.8100,45.2510],[19.7950,45.2500],[19.7800,45.2490],[19.7950,45.2500],[19.8100,45.2510]]}'),

-- 19. Centar - Banovina & Ulica Žarka Zrenjanina
('Centar - City Administration & Danube Park Loop',
 'Tight urban driving around Izvršno Veće, strict pedestrian priority zones, and standard urban speed limits.',
 '{"type":"LineString","coordinates":[[19.8460,45.2540],[19.8510,45.2520],[19.8490,45.2480],[19.8430,45.2510],[19.8460,45.2540]]}'),

-- 20. Veternik Entrance & Circular Intersection
('Veternik - Kružni Tok & Satellite Suburban Roads',
 'Suburban roundabout navigation, merging onto main transit roads, and navigating school zone speed limits.',
 '{"type":"LineString","coordinates":[[19.7750,45.2520],[19.7820,45.2550],[19.7880,45.2510],[19.7800,45.2480],[19.7750,45.2520]]}');




DROP TABLE practical_class CASCADE;



----------------------------------------------------------------------------------


-- Instructor: Vladimir Jovanovic (id = 3)
-- Assumes route ids 1-20 correspond to the order routes were inserted.
-- Assumes candidate_id references the user id directly.

INSERT INTO practical_class
(scheduled_start_time, scheduled_end_time, actual_start_time, actual_end_time,
 instructor_id, candidate_id, class_status, route_id, grade, comment, remarks,
 interruption_reason, interruption_note)
VALUES

-- === ENDED classes (already happened this morning) ===

-- Lena Reljic
('2026-08-20 08:00:00', '2026-08-20 09:30:00',
 '2026-08-20 08:02:00', '2026-08-20 09:28:00',
 3, 1, 'ENDED', 1, 4,
 'Good control on the boulevard loop, confident with lane changes.',
 'Needs to work on mirror checks before merging.',
 NULL, NULL),



-- Aleksandra Begovic
('2026-08-20 12:00:00', '2026-08-20 13:30:00',
 '2026-08-20 12:00:00', '2026-08-20 13:35:00',
 3, 4, 'ENDED', 8, 5,
 'Excellent handling of the roundabout and pedestrian crossings near the station.',
 'Ready to move on to highway driving next session.',
 NULL, NULL),

-- === ACCEPTED classes (upcoming later today) ===

-- Katarina Masovic
('2026-08-20 15:00:00', '2026-08-20 16:30:00',
 NULL, NULL,
 3, 5, 'ACCEPTED', NULL, 0, NULL, NULL,
 NULL, NULL),

-- Sara Sapundzija
('2026-08-20 17:00:00', '2026-08-20 18:30:00',
 NULL, NULL,
 3, 6, 'ACCEPTED', NULL, 0, NULL, NULL,
 NULL, NULL),

-- Ana Budimirovic
('2026-08-20 19:00:00', '2026-08-20 20:30:00',
 NULL, NULL,
 3, 7, 'ACCEPTED', NULL, 0, NULL, NULL,
 NULL, NULL);




