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





-- Preference rows
INSERT INTO preference (id, created_at, pickup_latitude, pickup_longitude, candidate_id) VALUES
                                                                                             (1, '2026-08-25 09:00:00', 45.2671, 19.8335, 6),  -- Novi Sad center
                                                                                             (2, '2026-08-25 09:05:00', 45.2551, 19.8452, 5),  -- Liman
                                                                                             (3, '2026-08-25 09:10:00', 45.2455, 19.8060, 4),  -- Klisa
                                                                                             (4, '2026-08-25 09:15:00', 45.2789, 19.8500, 7),  -- Detelinara
                                                                                             (5, '2026-08-25 09:20:00', 45.2600, 19.8200, 1),  -- Grbavica
                                                                                             (6, '2026-08-25 09:25:00', 45.2700, 19.7900, 8);  -- Novo Naselje


-- TimePreference rows


INSERT INTO time_preference (id, date, start_time, end_time, preference_id) VALUES
                                                                                (1, '2026-08-31', '09:00:00', '12:00:00', 1),  -- Mon, 3h
                                                                                (2, '2026-09-02', '14:00:00', '18:00:00', 1);  -- Wed, 4h

INSERT INTO time_preference (id, date, start_time, end_time, preference_id) VALUES
                                                                                (3, '2026-08-31', '10:00:00', '13:00:00', 2),  -- Mon, 3h
                                                                                (4, '2026-09-03', '08:00:00', '10:00:00', 2);  -- Thu, 2h

INSERT INTO time_preference (id, date, start_time, end_time, preference_id) VALUES
                                                                                (5, '2026-09-01', '09:00:00', '15:00:00', 3),  -- Tue, 6h
                                                                                (6, '2026-09-04', '16:00:00', '19:00:00', 3);  -- Fri, 3h

INSERT INTO time_preference (id, date, start_time, end_time, preference_id) VALUES
                                                                                (7, '2026-09-02', '15:00:00', '18:00:00', 4),  -- Wed, 3h
                                                                                (8, '2026-09-05', '09:00:00', '11:00:00', 4);  -- Sat, 2h

INSERT INTO time_preference (id, date, start_time, end_time, preference_id) VALUES
                                                                                (9,  '2026-09-01', '11:00:00', '16:00:00', 5), -- Tue, 5h
                                                                                (10, '2026-09-03', '13:00:00', '15:00:00', 5); -- Thu, 2h

-- Candidate 8 (preference_id 6)
INSERT INTO time_preference (id, date, start_time, end_time, preference_id) VALUES
                                                                                (11, '2026-08-31', '07:00:00', '13:00:00', 6), -- Mon, 6h
                                                                                (12, '2026-09-05', '09:00:00', '12:00:00', 6); -- Sat, 3h



INSERT INTO preference (id, created_at, pickup_latitude, pickup_longitude, candidate_id) VALUES
    (7, '2026-08-25 09:30:00', 45.2496, 19.8350, 2);  -- Novi Sad, Bulevar area

INSERT INTO time_preference (id, date, start_time, end_time, preference_id) VALUES
                                                                                (13, '2026-09-01', '13:00:00', '16:00:00', 7),  -- Tue, 3h -- overlaps with candidate 1's Tue slot (11-16) and candidate 4's Tue slot (9-15)
                                                                                (14, '2026-09-04', '10:00:00', '14:00:00', 7);  -- Fri, 4h



UPDATE preference
SET week_start_date = date_trunc('week', created_at)::date
WHERE week_start_date IS NULL;





-- Standard PostgreSQL Identity fix:
ALTER TABLE preference
    ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;

SELECT setval(pg_get_serial_sequence('preference', 'id'), COALESCE(MAX(id), 1)) FROM preference;




-- =============================================================================
-- TIME PREFERENCES
-- Candidate 1 -> Preference ID: 11 (1 slot)
-- Candidate 4 -> Preference ID: 12 (3 slots)
-- Candidate 5 -> Preference ID: 13 (5 slots)
-- Candidate 7 -> Preference ID: 14 (0 slots - NO_PREFERENCE)
-- =============================================================================

-- Candidate 1 (Preference ID: 11) -> 1 Slot
INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (11, '2026-09-08', '10:00:00', '12:00:00'); -- Tuesday 10:00-12:00


-- Candidate 4 (Preference ID: 12) -> 3 Slots
INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (12, '2026-09-07', '08:00:00', '10:00:00'); -- Monday 08:00-10:00

INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (12, '2026-09-09', '14:00:00', '16:00:00'); -- Wednesday 14:00-16:00

INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (12, '2026-09-11', '09:00:00', '11:00:00'); -- Friday 09:00-11:00


-- Candidate 5 (Preference ID: 13) -> 5 Slots
INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (13, '2026-09-07', '12:00:00', '14:00:00'); -- Monday 12:00-14:00

INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (13, '2026-09-08', '15:00:00', '17:00:00'); -- Tuesday 15:00-17:00

INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (13, '2026-09-09', '08:00:00', '10:00:00'); -- Wednesday 08:00-10:00

INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (13, '2026-09-10', '11:00:00', '13:00:00'); -- Thursday 11:00-13:00

INSERT INTO time_preference (preference_id, date, start_time, end_time)
VALUES (13, '2026-09-11', '16:00:00', '18:00:00'); -- Friday 16:00-18:00


-- Candidate 7 (Preference ID: 14) -> NO_PREFERENCE (0 rows needed)


-- 1. Drop the outdated constraint
ALTER TABLE candidate
    DROP CONSTRAINT candidate_status_check;

-- 2. Add the constraint back with EXAM_SCHEDULED included
-- (Replace/add all statuses defined in your Java CandidateStatus enum)
ALTER TABLE candidate
    ADD CONSTRAINT candidate_status_check
        CHECK (status IN ('THEORY','PRACTICAL','PASSED','PENDING' ,'EXAM_SCHEDULED'));

SELECT DISTINCT status FROM candidate;


DROP table practical_exam


INSERT INTO preference (candidate_id, week_start_date, status, location_name, created_at)
VALUES (1, '2026-09-07', 'SUBMITTED', 'Centar, Novi Sad', '2026-09-03 10:15:00');

-- Candidate 4: SUBMITTED (Moderate - 3 preferences)
INSERT INTO preference (candidate_id, week_start_date, status, location_name, created_at)
VALUES (4, '2026-09-07', 'SUBMITTED', 'Limana 3, Novi Sad', '2026-09-03 11:30:00');

-- Candidate 5: SUBMITTED (Flexible - 5 preferences)
INSERT INTO preference (candidate_id, week_start_date, status, location_name, created_at)
VALUES (5, '2026-09-07', 'SUBMITTED', 'Novo Naselje, Novi Sad', '2026-09-03 12:45:00');

-- Candidate 7: NO_PREFERENCE (No time preferences)
INSERT INTO preference (candidate_id, week_start_date, status, location_name, created_at)
VALUES (7, '2026-09-07', 'NO_PREFERENCE', 'Auto Skola HQ', '2026-09-03 14:00:00');










-- =================================================================
-- 1. VEHICLE INSERTS
-- =================================================================

-- Unassigned Vehicles (No Instructor, Status: AVAILABLE)
INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (1, 'NS-101-AA', '2027-05-15', 'AVAILABLE', 45000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (2, 'NS-102-AB', '2027-08-20', 'AVAILABLE', 32000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (3, 'NS-103-AC', '2026-11-10', 'AVAILABLE', 61000);

-- Instructor #3 Vehicle (Status: AVAILABLE)
INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (4, 'NS-203-DD', '2027-03-01', 'AVAILABLE', 78000);

-- Instructor Vehicles - OUT_OF_SERVICE (Assigned to Instructor #10 and #23)
INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (5, 'NS-310-OOS', '2026-10-01', 'OUT_OF_SERVICE', 185000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (6, 'NS-323-OOS', '2026-09-12', 'OUT_OF_SERVICE', 210000);

-- Instructor Vehicles - RESERVE (Assigned to Instructor #24 and #25)
INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (7, 'NS-424-RES', '2027-01-15', 'RESERVE', 95000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (8, 'NS-425-RES', '2027-04-30', 'RESERVE', 88000);

-- Regular Instructor Vehicles (Assigned to remaining Instructors, Status: AVAILABLE)
INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (9, 'NS-526-AV', '2027-06-10', 'AVAILABLE', 54000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (10, 'NS-527-AV', '2027-07-22', 'AVAILABLE', 41000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (11, 'NS-528-AV', '2027-09-05', 'AVAILABLE', 63000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (12, 'NS-529-AV', '2027-12-19', 'AVAILABLE', 29000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (13, 'NS-530-AV', '2027-02-14', 'AVAILABLE', 71000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (14, 'NS-531-AV', '2027-05-30', 'AVAILABLE', 38000);

INSERT INTO vehicle (id, registration_number, registration_expiry_date, status, current_mileage)
VALUES (15, 'NS-532-AV', '2027-10-11', 'AVAILABLE', 50000);


-- =================================================================
-- 2. INSTRUCTOR VEHICLE FOREIGN KEY UPDATES
-- =================================================================
-- Since Instructor owns the @JoinColumn(name = "vehicle_id"), update
-- the instructor table records with their assigned vehicle IDs.
-- =================================================================
-- INSTRUCTOR VEHICLE MAPPING
-- =================================================================

-- Instructor 3: Normal setup (driving their primary vehicle 4)
UPDATE instructor
SET vehicle_id = 4, primary_vehicle_id = 4
WHERE id = 3;

-- Instructor 10: Primary vehicle (5) is OUT_OF_SERVICE -> currently driving RESERVE vehicle (7)
UPDATE instructor
SET vehicle_id = 7, primary_vehicle_id = 5
WHERE id = 10;

-- Instructor 23: Primary vehicle (6) is OUT_OF_SERVICE -> currently driving RESERVE vehicle (8)
UPDATE instructor
SET vehicle_id = 8, primary_vehicle_id = 6
WHERE id = 23;

-- Instructors 24 & 25: Instructors whose primary cars are normal available vehicles, currently driving their primary cars
UPDATE instructor
SET vehicle_id = 9, primary_vehicle_id = 9
WHERE id = 24;

UPDATE instructor
SET vehicle_id = 10, primary_vehicle_id = 10
WHERE id = 25;

-- Remaining Instructors (26 through 32): Standard active = primary mappings
UPDATE instructor SET vehicle_id = 11, primary_vehicle_id = 11 WHERE id = 26;
UPDATE instructor SET vehicle_id = 12, primary_vehicle_id = 12 WHERE id = 27;
UPDATE instructor SET vehicle_id = 13, primary_vehicle_id = 13 WHERE id = 28;
UPDATE instructor SET vehicle_id = 14, primary_vehicle_id = 14 WHERE id = 29;
UPDATE instructor SET vehicle_id = 15, primary_vehicle_id = 15 WHERE id = 30;

-- Instructors 31 & 32: Unassigned active/primary (or map to unassigned vehicles 1 & 2 if needed)
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 31;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 32;







-- =================================================================
-- INSTRUCTOR VEHICLE MAPPINGS
-- =================================================================

-- Instructor 3: Driving their active primary vehicle (4)
UPDATE instructor
SET vehicle_id = 4, primary_vehicle_id = 4
WHERE id = 3;

-- Instructor 10: Primary vehicle (5, OUT_OF_SERVICE) -> active reserve vehicle (7)
UPDATE instructor
SET vehicle_id = 7, primary_vehicle_id = 5
WHERE id = 10;

-- Instructor 23: Primary vehicle (6, OUT_OF_SERVICE) -> active reserve vehicle (8)
UPDATE instructor
SET vehicle_id = 8, primary_vehicle_id = 6
WHERE id = 23;

-- Instructors 24 through 32: Currently HAVE NO ASSIGNED VEHICLES
-- (leaving Vehicles 1, 2, 3, 9, 10, 11, 12, 13, 14, 15 as AVAILABLE and unassigned)
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 24;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 25;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 26;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 27;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 28;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 29;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 30;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 31;
UPDATE instructor SET vehicle_id = NULL, primary_vehicle_id = NULL WHERE id = 32;






INSERT INTO vehicle_brand (id, brand, model, colour, year) VALUES
                                                               (1, 'Chevrolet', 'Impala', 'Black', '1967'),
                                                               (2, 'Volkswagen', 'Golf 7', 'White', '2019'),
                                                               (3, 'Toyota', 'Yaris', 'Red', '2021'),
                                                               (4, 'Peugeot', '208', 'Grey', '2020'),
                                                               (5, 'Skoda', 'Fabia', 'Blue', '2018');





UPDATE vehicle SET brand_id = 1 WHERE id IN (1, 5, 15);  -- 1967 Chevy Impala
UPDATE vehicle SET brand_id = 2 WHERE id IN (2, 3, 9);   -- VW Golf 7
UPDATE vehicle SET brand_id = 3 WHERE id IN (4, 7, 13);  -- Toyota Yaris
UPDATE vehicle SET brand_id = 4 WHERE id IN (8, 10, 12); -- Peugeot 208
UPDATE vehicle SET brand_id = 5 WHERE id IN (6, 11, 14); -- Skoda Fabia





-- attach identity behavior to the existing column, seeding it from current max id
ALTER TABLE vehicle ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;

-- make sure the internal identity sequence starts after existing data
SELECT setval(
               pg_get_serial_sequence('vehicle', 'id'),
               (SELECT COALESCE(MAX(id), 1) FROM vehicle)
       );



drop table vehicle_malfunction_record


ALTER TYPE vehicle_status ADD VALUE 'WAITING_FOR_PICKUP';

ALTER TABLE vehicles DROP CONSTRAINT vehicles_status_check;




-- 1. Drop the existing restriction constraint
ALTER TABLE vehicle DROP CONSTRAINT vehicle_status_check;

-- 2. Add the updated constraint including WAITING_FOR_PICKUP
ALTER TABLE vehicle ADD CONSTRAINT vehicle_status_check
    CHECK (status IN ('AVAILABLE', 'IN_USE', 'OUT_OF_SERVICE', 'RESERVE', 'WAITING_FOR_PICKUP'));









ALTER TABLE instructor_leave_request
    DROP CONSTRAINT instructor_leave_request_status_check;

ALTER TABLE instructor_leave_request
    ADD CONSTRAINT instructor_leave_request_status_check
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'USED'));











-- 1. PENDING — sick leave request awaiting admin review, next week
--    Should NOT block scheduling yet (only APPROVED blocks, per our earlier discussion)
INSERT INTO instructor_leave_request
(instructor_id, start_date, end_date, type, status, reason, admin_comment, requested_at, resolved_at)
VALUES
    (3, '2026-09-15', '2026-09-15', 'SICK', 'PENDING', 'Not feeling well, need the day off', NULL, '2026-09-09 08:30:00', NULL);

-- 2. APPROVED — single day, this should block manual/copy/alg scheduling on this date
INSERT INTO instructor_leave_request
(instructor_id, start_date, end_date, type, status, reason, admin_comment, requested_at, resolved_at)
VALUES
    (3, '2026-09-17', '2026-09-17', 'PERSONAL', 'APPROVED', 'Family appointment', 'Approved, enjoy', '2026-09-08 09:00:00', '2026-09-08 14:00:00');

-- 3. APPROVED — multi-day vacation, good for testing your range/getLeaveDatesInRange logic
INSERT INTO instructor_leave_request
(instructor_id, start_date, end_date, type, status, reason, admin_comment, requested_at, resolved_at)
VALUES
    (3, '2026-09-21', '2026-09-25', 'VACATION', 'APPROVED', 'Annual leave', 'Approved', '2026-08-20 10:00:00', '2026-08-21 09:15:00');

-- 4. REJECTED — should have zero effect on scheduling, good negative test case
INSERT INTO instructor_leave_request
(instructor_id, start_date, end_date, type, status, reason, admin_comment, requested_at, resolved_at)
VALUES
    (3, '2026-09-14', '2026-09-14', 'SICK', 'REJECTED', 'Wanted the day off', 'Too many classes scheduled already, please reschedule instead', '2026-09-07 11:00:00', '2026-09-07 16:40:00');

-- 5. USED — already-elapsed leave, for testing that past leave doesn't wrongly block future scheduling
INSERT INTO instructor_leave_request
(instructor_id, start_date, end_date, type, status, reason, admin_comment, requested_at, resolved_at)
VALUES
    (3, '2026-08-10', '2026-08-12', 'VACATION', 'USED', 'Summer trip', 'Approved and completed', '2026-07-01 09:00:00', '2026-07-02 12:00:00');