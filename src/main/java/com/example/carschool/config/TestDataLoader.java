package com.example.carschool.config;

import com.example.carschool.model.*;
import com.example.carschool.repo.*;
import com.example.carschool.service.LocationNoteService;
import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.load-test-data", havingValue = "true")
public class TestDataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleRepository vehicleRepository;
    private final InstructorRepository instructorRepository;
    private final PasswordEncoder passwordEncoder;
    private final FuelRecordRepository fuelRecordRepository;
    private final InstructorDocumentsRepository instructorDocumentsRepository;
    private final AdminRepository adminRepository;
    private final CandidateRepository candidateRepository;
    private final RouteRepository routeRepository;
    private final PreferenceRepository preferenceRepository;
    private final TimePreferenceRepository timePreferenceRepository;
    private final InstructorLeaveRequestRepository instructorLeaveRequestRepository;
    private final PracticalClassRepository practicalClassRepository;
    private final VehicleMalfunctionRecordRepository vehicleMalfunctionRecordRepository;
    private final PracticalExamRepository practicalExamRepository;
    private final LocationNoteService locationNoteService;
    private final LocationNoteRepository locationNoteRepository;


    @Override
    @Transactional

    public void run(String... args) throws Exception {


        if(userRepository.count() > 0 ) return;

        //roles

        Role candidateRole = roleRepository.save(new Role("ROLE_CANDIDATE"));
        Role instructorRole = roleRepository.save(new Role("ROLE_INSTRUCTOR"));
        Role adminRole = roleRepository.save(new Role("ROLE_ADMIN"));


        //admins

        // --- Admins ---

        Admin a1 = new Admin();
        a1.setUsername("admin_marija");
        a1.setName("Marija");
        a1.setLastname("Radović");
        a1.setEmail("marija.radovic@gmail.com");
        a1.setPassword(passwordEncoder.encode("123"));
        a1.setRole(adminRole);
        a1.setEnabled(true);
        adminRepository.save(a1);

        Admin a2 = new Admin();
        a2.setUsername("admin_bojan");
        a2.setName("Bojan");
        a2.setLastname("Simić");
        a2.setEmail("bojan.simic@gmail.com");
        a2.setPassword(passwordEncoder.encode("123"));
        a2.setRole(adminRole);
        a2.setEnabled(true);
        adminRepository.save(a2);

        Admin a3 = new Admin();
        a3.setUsername("admin_jelena");
        a3.setName("Jelena");
        a3.setLastname("Kovačević");
        a3.setEmail("jelena.kovacevic@gmail.com");
        a3.setPassword(passwordEncoder.encode("123"));
        a3.setRole(adminRole);
        a3.setEnabled(true);
        adminRepository.save(a3);



        //brands

        VehicleBrand brand1 = new VehicleBrand();
        brand1.setBrand("Volkswagen");
        brand1.setModel("Golf");
        brand1.setColour("White");
        brand1.setYear("2021");
        vehicleBrandRepository.save(brand1);

        VehicleBrand brand2 = new VehicleBrand();
        brand2.setBrand("Toyota");
        brand2.setModel("Corolla");
        brand2.setColour("Silver");
        brand2.setYear("2022");
        vehicleBrandRepository.save(brand2);

        VehicleBrand brand3 = new VehicleBrand();
        brand3.setBrand("Škoda");
        brand3.setModel("Fabia");
        brand3.setColour("Blue");
        brand3.setYear("2020");
        vehicleBrandRepository.save(brand3);

        VehicleBrand brand4 = new VehicleBrand();
        brand4.setBrand("Renault");
        brand4.setModel("Clio");
        brand4.setColour("Red");
        brand4.setYear("2023");
        vehicleBrandRepository.save(brand4);

        VehicleBrand brand5 = new VehicleBrand();
        brand5.setBrand("Opel");
        brand5.setModel("Astra");
        brand5.setColour("Black");
        brand5.setYear("2019");
        vehicleBrandRepository.save(brand5);

        VehicleBrand brand6 = new VehicleBrand();
        brand6.setBrand("Chevrolet");
        brand6.setModel("Impala");
        brand6.setColour("Black");
        brand6.setYear("1967");
        vehicleBrandRepository.save(brand6);


        //cars




        Vehicle v1 = new Vehicle();
        v1.setRegistrationNumber("NS-100-AA");
        v1.setRegistrationExpiryDate(LocalDate.of(2027, 3, 15));
        v1.setStatus(VehicleStatus.IN_USE);
        v1.setCurrentMileage(32000);
        v1.setBrand(brand1);
        vehicleRepository.save(v1);

        Vehicle v2 = new Vehicle();
        v2.setRegistrationNumber("NS-101-AB");
        v2.setRegistrationExpiryDate(LocalDate.of(2026, 11, 1));
        v2.setStatus(VehicleStatus.IN_USE);
        v2.setCurrentMileage(51000);
        v2.setBrand(brand2);
        vehicleRepository.save(v2);

        Vehicle v3 = new Vehicle();
        v3.setRegistrationNumber("NS-102-AC");
        v3.setRegistrationExpiryDate(LocalDate.of(2027, 6, 20));
        v3.setStatus(VehicleStatus.IN_USE);
        v3.setCurrentMileage(18000);
        v3.setBrand(brand3);
        vehicleRepository.save(v3);

        Vehicle v4 = new Vehicle();
        v4.setRegistrationNumber("NS-103-AD");
        v4.setRegistrationExpiryDate(LocalDate.of(2026, 9, 30));
        v4.setStatus(VehicleStatus.IN_USE);
        v4.setCurrentMileage(64000);
        v4.setBrand(brand4);
        vehicleRepository.save(v4);

        Vehicle v5 = new Vehicle();
        v5.setRegistrationNumber("NS-104-AE");
        v5.setRegistrationExpiryDate(LocalDate.of(2027, 1, 10));
        v5.setStatus(VehicleStatus.IN_USE);
        v5.setCurrentMileage(88000);
        v5.setBrand(brand5);
        vehicleRepository.save(v5);

        Vehicle v6 = new Vehicle();
        v6.setRegistrationNumber("NS-105-AF");
        v6.setRegistrationExpiryDate(LocalDate.of(2027, 4, 5));
        v6.setStatus(VehicleStatus.OUT_OF_SERVICE);
        v6.setCurrentMileage(120000);
        v6.setBrand(brand6);
        vehicleRepository.save(v6);

        VehicleMalfunctionRecord vehicleMalfunctionRecord = new VehicleMalfunctionRecord();
        vehicleMalfunctionRecord.setMalfunctionDate(LocalDate.of(2026, 8, 21));
        vehicleMalfunctionRecord.setFixed(false);
        vehicleMalfunctionRecordRepository.save(vehicleMalfunctionRecord);

        Vehicle v7 = new Vehicle();
        v7.setRegistrationNumber("BG-200-BA");
        v7.setRegistrationExpiryDate(LocalDate.of(2026, 12, 12));
        v7.setStatus(VehicleStatus.RESERVE);
        v7.setCurrentMileage(27000);
        v7.setBrand(brand1);
        vehicleRepository.save(v7);

        Vehicle v8 = new Vehicle();
        v8.setRegistrationNumber("BG-201-BB");
        v8.setRegistrationExpiryDate(LocalDate.of(2027, 2, 18));
        v8.setStatus(VehicleStatus.AVAILABLE);
        v8.setCurrentMileage(43000);
        v8.setBrand(brand2);
        vehicleRepository.save(v8);

        Vehicle v9 = new Vehicle();
        v9.setRegistrationNumber("BG-202-BC");
        v9.setRegistrationExpiryDate(LocalDate.of(2026, 10, 25));
        v9.setStatus(VehicleStatus.AVAILABLE);
        v9.setCurrentMileage(59000);
        v9.setBrand(brand3);
        vehicleRepository.save(v9);

        Vehicle v10 = new Vehicle();
        v10.setRegistrationNumber("BG-203-BD");
        v10.setRegistrationExpiryDate(LocalDate.of(2027, 5, 8));
        v10.setStatus(VehicleStatus.AVAILABLE);
        v10.setCurrentMileage(15000);
        v10.setBrand(brand4);
        vehicleRepository.save(v10);

        Vehicle v11 = new Vehicle();
        v11.setRegistrationNumber("BG-204-BE");
        v11.setRegistrationExpiryDate(LocalDate.of(2026, 8, 14));
        v11.setStatus(VehicleStatus.AVAILABLE);
        v11.setCurrentMileage(72000);
        v11.setBrand(brand5);
        vehicleRepository.save(v11);

        Vehicle v12 = new Vehicle();
        v12.setRegistrationNumber("BG-205-BF");
        v12.setRegistrationExpiryDate(LocalDate.of(2027, 7, 22));
        v12.setStatus(VehicleStatus.AVAILABLE);
        v12.setCurrentMileage(95000);
        v12.setBrand(brand6);
        vehicleRepository.save(v12);

        Vehicle v13 = new Vehicle();
        v13.setRegistrationNumber("NI-300-CA");
        v13.setRegistrationExpiryDate(LocalDate.of(2027, 3, 3));
        v13.setStatus(VehicleStatus.AVAILABLE);
        v13.setCurrentMileage(21000);
        v13.setBrand(brand1);
        vehicleRepository.save(v13);

        Vehicle v14 = new Vehicle();
        v14.setRegistrationNumber("NI-301-CB");
        v14.setRegistrationExpiryDate(LocalDate.of(2026, 11, 19));
        v14.setStatus(VehicleStatus.AVAILABLE);
        v14.setCurrentMileage(38000);
        v14.setBrand(brand2);
        vehicleRepository.save(v14);

        Vehicle v15 = new Vehicle();
        v15.setRegistrationNumber("NI-302-CC");
        v15.setRegistrationExpiryDate(LocalDate.of(2027, 9, 9));
        v15.setStatus(VehicleStatus.AVAILABLE);
        v15.setCurrentMileage(11000);
        v15.setBrand(brand3);
        vehicleRepository.save(v15);


        //instructors




        Instructor i1 = new Instructor();
        i1.setName("Vladimir");
        i1.setLastname("Jovanović");
        i1.setEmail("jova@gmail.com");
        i1.setUsername("vladimir.jovanovic");
        i1.setPassword(passwordEncoder.encode("123"));
        i1.setRole(instructorRole);
        i1.setMaxCapacity(11);
        i1.setAnnualLeaveAllowance(30);
        i1.setCategory(Category.B);
        i1.setActive(true);
        i1.setPrimaryVehicle(v1);
        i1.setVehicle(v1);
        instructorRepository.save(i1);

        Instructor i2 = new Instructor();
        i2.setName("Natalija");
        i2.setLastname("Tirnanic");
        i2.setUsername("natalija.tirnanic");
        i2.setEmail("natalija.tirnanic@gmail.com");
        i2.setPassword(passwordEncoder.encode("123"));
        i2.setRole(instructorRole);
        i2.setMaxCapacity(11);
        i2.setAnnualLeaveAllowance(30);
        i2.setCategory(Category.B);
        i2.setActive(true);
        i2.setPrimaryVehicle(v2);
        i2.setVehicle(v2);
        instructorRepository.save(i2);

        Instructor i3 = new Instructor();
        i3.setName("Milan");
        i3.setLastname("Ilić");
        i3.setEmail("milan.ilic@gmail.com");
        i3.setUsername("milan.ilic");
        i3.setPassword(passwordEncoder.encode("123"));
        i3.setRole(instructorRole);
        i3.setMaxCapacity(11);
        i3.setAnnualLeaveAllowance(30);
        i3.setCategory(Category.B);
        i3.setActive(true);
        i3.setPrimaryVehicle(v3);
        i3.setVehicle(v3);
        instructorRepository.save(i3);

        Instructor i4 = new Instructor();
        i4.setName("Stefan");
        i4.setLastname("Nikolić");
        i4.setEmail("stefan.nikolic@gmail.com");
        i4.setUsername("stefan.nikolic");
        i4.setPassword(passwordEncoder.encode("123"));
        i4.setRole(instructorRole);
        i4.setMaxCapacity(11);
        i4.setAnnualLeaveAllowance(30);
        i4.setCategory(Category.B);
        i4.setActive(true);
        i4.setPrimaryVehicle(v4);
        i4.setVehicle(v4);
        instructorRepository.save(i4);

        Instructor i5 = new Instructor();
        i5.setName("Dušan");
        i5.setLastname("Đorđević");
        i5.setEmail("dusan.djordjevic@gmail.com");
        i5.setUsername("dusan.djordjevic");
        i5.setPassword(passwordEncoder.encode("123"));
        i5.setRole(instructorRole);
        i5.setMaxCapacity(11);
        i5.setAnnualLeaveAllowance(30);
        i5.setCategory(Category.B);
        i5.setActive(true);
        i5.setPrimaryVehicle(v5);
        i5.setVehicle(v5);
        instructorRepository.save(i5);

        Instructor i6 = new Instructor();
        i6.setName("Aleksandar");
        i6.setLastname("Stojanović");
        i6.setEmail("aleksandar.stojanovic@gmail.com");
        i6.setUsername("aleksandar.stojanovic");
        i6.setPassword(passwordEncoder.encode("123"));
        i6.setRole(instructorRole);
        i6.setMaxCapacity(11);
        i6.setAnnualLeaveAllowance(30);
        i6.setCategory(Category.B);
        i6.setActive(true);
        i6.setPrimaryVehicle(v6);
        i6.setVehicle(v7);
        instructorRepository.save(i6);

        Instructor i7 = new Instructor();
        i7.setName("Vladimir");
        i7.setLastname("Popović");
        i7.setEmail("vladimir.popovic@gmail.com");
        i7.setUsername("vladimir.popovic");
        i7.setPassword(passwordEncoder.encode("123"));
        i7.setRole(instructorRole);
        i7.setMaxCapacity(11);
        i7.setAnnualLeaveAllowance(30);
        i7.setCategory(Category.C);
        i7.setActive(true);
        instructorRepository.save(i7);

        Instructor i8 = new Instructor();
        i8.setName("Petar");
        i8.setLastname("Marković");
        i8.setEmail("petar.markovic@gmail.com");
        i8.setUsername("petar.markovic");
        i8.setPassword(passwordEncoder.encode("123"));
        i8.setRole(instructorRole);
        i8.setMaxCapacity(11);
        i8.setAnnualLeaveAllowance(30);
        i8.setCategory(Category.CE);
        i8.setActive(true);
        instructorRepository.save(i8);

        Instructor i9 = new Instructor();
        i9.setName("Uroš");
        i9.setLastname("Pavlović");
        i9.setEmail("uros.pavlovic@gmail.com");
        i9.setUsername("uros.pavlovic");
        i9.setPassword(passwordEncoder.encode("123"));
        i9.setRole(instructorRole);
        i9.setMaxCapacity(11);
        i9.setAnnualLeaveAllowance(30);
        i9.setCategory(Category.A);
        i9.setActive(true);
        instructorRepository.save(i9);

        Instructor i10 = new Instructor();
        i10.setName("Filip");
        i10.setLastname("Kostić");
        i10.setEmail("filip.kostic@gmail.com");
        i10.setUsername("filip.kostic");
        i10.setPassword(passwordEncoder.encode("123"));
        i10.setRole(instructorRole);
        i10.setMaxCapacity(11);
        i10.setAnnualLeaveAllowance(30);
        i10.setCategory(Category.D);
        i10.setActive(true);
        instructorRepository.save(i10);

        // inst docs

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2030, 4, 12), i1));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2027, 9, 30), i1));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2026, 10, 15), i1));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2029, 6, 20), i2));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2026, 12, 1), i2));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2027, 2, 8), i2));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2031, 1, 5), i3));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2026, 9, 25), i3));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2026, 11, 30), i3));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2028, 3, 17), i4));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2027, 5, 22), i4));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2026, 9, 20), i4)); // already expired relative to Sep 2026

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2030, 8, 9), i5));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2026, 10, 5), i5));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2027, 1, 14), i5));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2029, 11, 3), i6));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2026, 8, 30), i6)); // already expired
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2026, 12, 19), i6));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2028, 7, 27), i7));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2027, 3, 11), i7));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2026, 10, 2), i7));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2030, 2, 14), i8));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2026, 11, 8), i8));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2027, 4, 6), i8));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2029, 9, 19), i9));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2026, 9, 10), i9)); // already expired
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2026, 12, 25), i9));

        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.DRIVING_LICENSE, LocalDate.of(2031, 5, 1), i10));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.INSTRUCTOR_LICENSE, LocalDate.of(2027, 7, 17), i10));
        instructorDocumentsRepository.save(new InstructorDocuments(DocumentType.MEDICAL_CERTIFICATE, LocalDate.of(2026, 11, 11), i10));



        //fuel record

        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,5), 28.0, 5740.0, 29300, v1, i1));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,20), 32.0, 6560.0, 29800, v1, i1));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,5), 30.0, 6150.0, 30300, v1, i1));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,20), 27.0, 5535.0, 30800, v1, i1));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,5), 33.0, 6765.0, 31300, v1, i1));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,20), 29.0, 5945.0, 31800, v1, i1));


        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,4), 31.0, 6355.0, 48300, v2, i2));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,19), 26.0, 5330.0, 48800, v2, i2));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,4), 34.0, 6970.0, 49300, v2, i2));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,19), 30.0, 6150.0, 49800, v2, i2));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,4), 28.0, 5740.0, 50300, v2, i2));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,19), 32.0, 6560.0, 50800, v2, i2));

        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,6), 24.0, 4920.0, 16650, v3, i3));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,21), 22.0, 4510.0, 16900, v3, i3));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,6), 25.0, 5125.0, 17150, v3, i3));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,21), 23.0, 4715.0, 17400, v3, i3));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,6), 26.0, 5330.0, 17650, v3, i3));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,21), 24.0, 4920.0, 17900, v3, i3));

        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,3), 35.0, 7175.0, 60700, v4, i4));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,18), 33.0, 6765.0, 61300, v4, i4));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,3), 36.0, 7380.0, 61900, v4, i4));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,18), 34.0, 6970.0, 62500, v4, i4));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,3), 37.0, 7585.0, 63100, v4, i4));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,18), 35.0, 7175.0, 63700, v4, i4));

        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,7), 38.0, 7790.0, 85300, v5, i5));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,22), 36.0, 7380.0, 85800, v5, i5));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,7), 39.0, 7995.0, 86300, v5, i5));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,22), 37.0, 7585.0, 86800, v5, i5));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,7), 40.0, 8200.0, 87300, v5, i5));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,22), 38.0, 7790.0, 87800, v5, i5));


        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,8), 25.0, 5125.0, 117200, v6, i6));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,23), 23.0, 4715.0, 117600, v6, i6));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,8), 26.0, 5330.0, 118000, v6, i6));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,23), 20.0, 4100.0, 118300, v6, i6));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,8), 18.0, 3690.0, 118500, v6, i6));

        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,6,10), 20.0, 4100.0, 26700, v7, i6));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,7,10), 22.0, 4510.0, 26850, v7, i6));
        fuelRecordRepository.save(new FuelRecord(LocalDate.of(2026,8,10), 21.0, 4305.0, 26950, v7, i6));


        //candidates



        //i1 - pending


        makeCandidate("srdjan.milanovic","Srđan","Milanović","srdjan.milanovic@mail.com",
                LocalDateTime.now().minusMonths(4), Category.B, TrainingStatus.PENDING, i1,
                "Klisa, Novi Sad", LocalDate.of(2026,2,10), 40, 40, candidateRole);

        makeCandidate("iva.cvetkovic","Iva","Cvetković","iva.cvetkovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PENDING, i1,
                "Sajmište, Novi Sad", LocalDate.of(2026,3,1), 40, 40, candidateRole);

        makeCandidate("branko.simic","Branko","Simić","branko.simic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PENDING, i1,
                "Adice, Novi Sad", LocalDate.of(2026,3,15), 40, 40, candidateRole);





        //i2

        //pending
        makeCandidate("dea.radisic","Dea","Radišić","dea.radisic@mail.com",
                LocalDateTime.now().minusMonths(4), Category.B, TrainingStatus.PENDING, i2,
                "Žeželj Most area, Novi Sad", LocalDate.of(2026,2,14), 40, 40, candidateRole);

        makeCandidate("stevan.brankovic","Stevan","Branković","stevan.brankovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PENDING, i2,
                "Industrijska Zona Sever, Novi Sad", LocalDate.of(2026,3,2), 40, 40, candidateRole);

        makeCandidate("una.paunovic","Una","Paunović","una.paunovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PENDING, i2,
                "Futoški Put, Novi Sad", LocalDate.of(2026,3,17), 40, 40, candidateRole);




        // PASSED - instructor i1
        Candidate martaPesic = makeCandidate("marta.pesic", "Marta", "Pešić", "marta.pesic@mail.com",
                LocalDateTime.now().minusMonths(5), Category.B, TrainingStatus.PASSED, i1,
                "Liman, Novi Sad", LocalDate.of(2026, 1, 10), 40, 40, candidateRole);

        Candidate goranJovanovic = makeCandidate("goran.jovanovic", "Goran", "Jovanović", "goran.jovanovic@mail.com",
                LocalDateTime.now().minusMonths(5), Category.B, TrainingStatus.PASSED, i1,
                "Grbavica, Novi Sad", LocalDate.of(2026, 1, 15), 40, 40, candidateRole);

        Candidate vanjaKrstic = makeCandidate("vanja.krstic", "Vanja", "Krstić", "vanja.krstic@mail.com",
                LocalDateTime.now().minusMonths(4), Category.B, TrainingStatus.PASSED, i1,
                "Detelinara, Novi Sad", LocalDate.of(2026, 2, 3), 40, 40, candidateRole);

        Candidate teodoraMilovanovic = makeCandidate("teodora.milovanovic", "Teodora", "Milovanović", "teodora.milovanovic@mail.com",
                LocalDateTime.now().minusMonths(4), Category.B, TrainingStatus.PASSED, i1,
                "Novo Naselje, Novi Sad", LocalDate.of(2026, 2, 18), 40, 40, candidateRole);

        Candidate aleksaStamenkovic = makeCandidate("aleksa.stamenkovic", "Aleksa", "Stamenković", "aleksa.stamenkovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PASSED, i1,
                "Petrovaradin, Novi Sad", LocalDate.of(2026, 3, 5), 40, 40, candidateRole);

        Candidate sofijaRadenkovic = makeCandidate("sofija.radenkovic", "Sofija", "Radenković", "sofija.radenkovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PASSED, i1,
                "Telep, Novi Sad", LocalDate.of(2026, 3, 20), 43, 43, candidateRole);

            // EXAM_SCHEDULED - instructor i1
        Candidate vukasinJovicic = makeCandidate("vukasin.jovicic", "Vukašin", "Jovičić", "vukasin.jovicic@mail.com",
                LocalDateTime.now().minusMonths(4), Category.B, TrainingStatus.EXAM_SCHEDULED, i1,
                "Bulevar Evrope, Novi Sad", LocalDate.of(2026, 2, 25), 40, 40, candidateRole);

        Candidate elenaVukasinovic = makeCandidate("elena.vukasinovic", "Elena", "Vukašinović", "elena.vukasinovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.EXAM_SCHEDULED, i1,
                "Veternik, Novi Sad", LocalDate.of(2026, 3, 10), 40, 40, candidateRole);

            // PASSED - instructor i2
        Candidate darioPavkov = makeCandidate("dario.pavkov", "Dario", "Pavkov", "dario.pavkov@mail.com",
                LocalDateTime.now().minusMonths(5), Category.B, TrainingStatus.PASSED, i2,
                "Podbara, Novi Sad", LocalDate.of(2026, 1, 12), 40, 40, candidateRole);

        Candidate ljubicaRankovic = makeCandidate("ljubica.rankovic", "Ljubica", "Ranković", "ljubica.rankovic@mail.com",
                LocalDateTime.now().minusMonths(5), Category.B, TrainingStatus.PASSED, i2,
                "Salajka, Novi Sad", LocalDate.of(2026, 1, 20), 40, 40, candidateRole);

        Candidate nikolaGojkovic = makeCandidate("nikola.gojkovic", "Nikola", "Gojković", "nikola.gojkovic@mail.com",
                LocalDateTime.now().minusMonths(4), Category.B, TrainingStatus.PASSED, i2,
                "Centar, Novi Sad", LocalDate.of(2026, 2, 5), 40, 40, candidateRole);

            // EXAM_SCHEDULED - instructor i2
        Candidate filipKrunic = makeCandidate("filip.krunic", "Filip", "Krunić", "filip.krunic@mail.com",
                LocalDateTime.now().minusMonths(4), Category.B, TrainingStatus.EXAM_SCHEDULED, i2,
                "Podbara, Novi Sad", LocalDate.of(2026, 2, 19), 40, 40, candidateRole);

        Candidate jovanaStevic = makeCandidate("jovana.stevic", "Jovana", "Stević", "jovana.stevic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.EXAM_SCHEDULED, i2,
                "Salajka, Novi Sad", LocalDate.of(2026, 3, 4), 40, 40, candidateRole);

        Candidate aleksandarGavrilovic = makeCandidate("aleksandar.gavrilovic", "Aleksandar", "Gavrilović", "aleksandar.gavrilovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.EXAM_SCHEDULED, i2,
                "Centar, Novi Sad", LocalDate.of(2026, 3, 19), 40, 40, candidateRole);

        Candidate bojanaStefanovic = makeCandidate("bojana.stefanovic", "Bojana", "Stefanović", "bojana.stefanovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.EXAM_SCHEDULED, i2,
                "Univerzitetski Grad, Novi Sad", LocalDate.of(2026, 4, 2), 40, 40, candidateRole);


        //waiting for instructor

        makeCandidate("mateja.savic","Mateja","Savić","mateja.savic@mail.com",
                LocalDateTime.now().minusDays(5), Category.B, TrainingStatus.WAITING_FOR_INSTRUCTOR, null,
                "Liman, Novi Sad", LocalDate.of(2026,8,20), 0, 0, candidateRole);

        makeCandidate("valentina.zoric","Valentina","Zorić","valentina.zoric@mail.com",
                LocalDateTime.now().minusDays(5), Category.C, TrainingStatus.WAITING_FOR_INSTRUCTOR, null,
                "Grbavica, Novi Sad", LocalDate.of(2026,8,22), 0, 0, candidateRole);

        makeCandidate("kosara.jokic","Kosara","Jokić","kosara.jokic@mail.com",
                LocalDateTime.now().minusDays(4), Category.B, TrainingStatus.WAITING_FOR_INSTRUCTOR, null,
                "Detelinara, Novi Sad", LocalDate.of(2026,8,24), 0, 0, candidateRole);

        makeCandidate("bojan.tesic","Bojan","Tešić","bojan.tesic@mail.com",
                LocalDateTime.now().minusDays(4), Category.B, TrainingStatus.WAITING_FOR_INSTRUCTOR, null,
                "Novo Naselje, Novi Sad", LocalDate.of(2026,8,26), 0, 0, candidateRole);

        makeCandidate("ines.markovic","Ines","Marković","ines.markovic@mail.com",
                LocalDateTime.now().minusDays(3), Category.CE, TrainingStatus.WAITING_FOR_INSTRUCTOR, null,
                "Petrovaradin, Novi Sad", LocalDate.of(2026,8,28), 0, 0, candidateRole);

        makeCandidate("aca.nikolic","Aleksa","Nikolić","aca.nikolic@mail.com",
                LocalDateTime.now().minusDays(2), Category.B, TrainingStatus.WAITING_FOR_INSTRUCTOR, null,
                "Telep, Novi Sad", LocalDate.of(2026,9,1), 0, 0, candidateRole);

        makeCandidate("teodora.blagojevic","Teodora","Blagojević","teodora.blagojevic@mail.com",
                LocalDateTime.now().minusDays(1), Category.B, TrainingStatus.WAITING_FOR_INSTRUCTOR, null,
                "Klisa, Novi Sad", LocalDate.of(2026,9,5), 0, 0, candidateRole);


        //practicallll

        List<Candidate> practicalCandidates = new ArrayList<>();

        practicalCandidates.add(makeCandidate("tanja.civic","Tanja","Civic","tanjac@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i1,
                "Podbara, Novi Sad", LocalDate.of(2026,5,2), 39, 40, candidateRole));

        practicalCandidates.add(makeCandidate("dejan.mihajlovic","Dejan","Mihajlović","dejan.mihajlovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i3,
                "Podbara, Novi Sad", LocalDate.of(2026,5,2), 6, 40, candidateRole));

        practicalCandidates.add(makeCandidate("tijana.arsic","Tijana","Arsić","tijana.arsic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i3,
                "Salajka, Novi Sad", LocalDate.of(2026,5,7), 14, 40, candidateRole));

        practicalCandidates.add(makeCandidate("lazar.filipovic","Lazar","Filipović","lazar.filipovic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i3,
                "Centar, Novi Sad", LocalDate.of(2026,5,12), 21, 40, candidateRole));

        practicalCandidates.add(makeCandidate("anja.dordjevic","Anja","Đorđević","anja.dordjevic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i3,
                "Klisa, Novi Sad", LocalDate.of(2026,5,17), 29, 40, candidateRole));

        practicalCandidates.add(makeCandidate("marko.zecevic","Marko","Zečević","marko.zecevic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i4,
                "Detelinara, Novi Sad", LocalDate.of(2026,5,5), 9, 40, candidateRole));

        practicalCandidates.add(makeCandidate("teodora.kostic","Teodora","Kostić","teodora.kostic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i4,
                "Veternik, Novi Sad", LocalDate.of(2026,5,14), 17, 40, candidateRole));

        practicalCandidates.add(makeCandidate("ognjen.perisic","Ognjen","Perišić","ognjen.perisic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i4,
                "Futoški Put, Novi Sad", LocalDate.of(2026,5,20), 25, 40, candidateRole));

        practicalCandidates.add(makeCandidate("dunja.nedeljkovic","Dunja","Nedeljković","dunja.nedeljkovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i5,
                "Sajmište, Novi Sad", LocalDate.of(2026,5,3), 7, 40, candidateRole));

        practicalCandidates.add(makeCandidate("vasilije.stamenkovic","Vasilije","Stamenković","vasilije.stamenkovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i5,
                "Adice, Novi Sad", LocalDate.of(2026,5,8), 16, 40, candidateRole));

        practicalCandidates.add(makeCandidate("minja.aleksic","Minja","Aleksić","minja.aleksic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i5,
                "Univerzitetski Grad, Novi Sad", LocalDate.of(2026,5,13), 22, 40, candidateRole));

        practicalCandidates.add(makeCandidate("pavle.stevanovic","Pavle","Stevanović","pavle.stevanovic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i5,
                "Bulevar Oslobođenja, Novi Sad", LocalDate.of(2026,5,18), 30, 40, candidateRole));

        practicalCandidates.add(makeCandidate("nadja.kovacevic","Nađa","Kovačević","nadja.kovacevic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i6,
                "Industrijska Zona Sever, Novi Sad", LocalDate.of(2026,5,25), 12, 40, candidateRole));

        practicalCandidates.add(makeCandidate("mihailo.jeremic","Mihailo","Jeremić","mihailo.jeremic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i6,
                "Bulevar Evrope, Novi Sad", LocalDate.of(2026,5,29), 19, 40, candidateRole));

        practicalCandidates.add(makeCandidate("stefan.radovanovic","Stefan","Radovanović","stefan.radovanovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PRACTICAL, i2,
                "Podbara, Novi Sad", LocalDate.of(2026,4,4), 4, 40, candidateRole));

        practicalCandidates.add(makeCandidate("marija.stankovic","Marija","Stanković","marija.stankovic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PRACTICAL, i2,
                "Salajka, Novi Sad", LocalDate.of(2026,4,9), 10, 40, candidateRole));

        practicalCandidates.add(makeCandidate("aleksa.milic","Aleksa","Milić","aleksa.milic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PRACTICAL, i2,
                "Železnička Stanica, Novi Sad", LocalDate.of(2026,4,13), 15, 40, candidateRole));

        practicalCandidates.add(makeCandidate("jovana.petrovic","Jovana","Petrović","jovana.petrovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i2,
                "Centar, Novi Sad", LocalDate.of(2026,4,18), 19, 40, candidateRole));

        practicalCandidates.add(makeCandidate("dario.ninkovic","Dario","Ninković","dario.ninkovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i2,
                "Žeželj Most area, Novi Sad", LocalDate.of(2026,4,22), 24, 40, candidateRole));

        practicalCandidates.add(makeCandidate("milica.jaksic","Milica","Jakšić","milica.jaksic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i2,
                "Univerzitetski Grad, Novi Sad", LocalDate.of(2026,4,27), 28, 40, candidateRole));

        practicalCandidates.add(makeCandidate("bogdan.trifunovic","Bogdan","Trifunović","bogdan.trifunovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i2,
                "Industrijska Zona Sever, Novi Sad", LocalDate.of(2026,5,1), 8, 40, candidateRole));

        practicalCandidates.add(makeCandidate("nina.lukic","Nina","Lukić","nina.lukic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i2,
                "Bulevar Oslobođenja, Novi Sad", LocalDate.of(2026,5,6), 13, 40, candidateRole));

        practicalCandidates.add(makeCandidate("vuk.spasojevic","Vuk","Spasojević","vuk.spasojevic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i2,
                "Futoški Put, Novi Sad", LocalDate.of(2026,5,11), 33, 40, candidateRole));

        practicalCandidates.add(makeCandidate("katarina.blagojevic","Katarina","Blagojević","katarina.blagojevic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i2,
                "Klisa, Novi Sad", LocalDate.of(2026,5,16), 37, 40, candidateRole));

        practicalCandidates.add(makeCandidate("nemanja.gavric","Nemanja","Gavrić","nemanja.gavric@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i2,
                "Veternik, Novi Sad", LocalDate.of(2026,5,21), 21, 40, candidateRole));

        practicalCandidates.add(makeCandidate("lena.reljic","Lena","Reljic","lena.reljic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PRACTICAL, i1,
                "Liman, Novi Sad", LocalDate.of(2026,4,3), 5, 40, candidateRole));

        practicalCandidates.add(makeCandidate("sara.sapun","Sara","Sapun","sara.sapun@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PRACTICAL, i1,
                "Grbavica, Novi Sad", LocalDate.of(2026,4,8), 9, 40, candidateRole));

        practicalCandidates.add(makeCandidate("sara.janjic","Sara","Janjic","sara.janjic@mail.com",
                LocalDateTime.now().minusMonths(3), Category.B, TrainingStatus.PRACTICAL, i1,
                "Detelinara, Novi Sad", LocalDate.of(2026,4,12), 14, 40, candidateRole));

        practicalCandidates.add(makeCandidate("aleksandra.begovic","Aleksandra","Begovic","aleksandra.begovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i1,
                "Novo Naselje, Novi Sad", LocalDate.of(2026,4,17), 18, 40, candidateRole));

        practicalCandidates.add(makeCandidate("milos.zivkovic","Miloš","Živković","milos.zivkovic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i1,
                "Petrovaradin, Novi Sad", LocalDate.of(2026,4,21), 22, 40, candidateRole));

        practicalCandidates.add(makeCandidate("ivana.maric","Ivana","Marić","ivana.maric@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i1,
                "Telep, Novi Sad", LocalDate.of(2026,4,26), 27, 40, candidateRole));

        practicalCandidates.add(makeCandidate("petar.ristic","Petar","Ristić","petar.ristic@mail.com",
                LocalDateTime.now().minusMonths(2), Category.B, TrainingStatus.PRACTICAL, i1,
                "Klisa, Novi Sad", LocalDate.of(2026,4,30), 40, 40, candidateRole));

        practicalCandidates.add(makeCandidate("tamara.vukovic","Tamara","Vuković","tamara.vukovic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i1,
                "Sajmište, Novi Sad", LocalDate.of(2026,5,4), 12, 40, candidateRole));

        practicalCandidates.add(makeCandidate("luka.antic","Luka","Antić","luka.antic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i1,
                "Adice, Novi Sad", LocalDate.of(2026,5,9), 6, 40, candidateRole));

        practicalCandidates.add(makeCandidate("sara.milosevic","Sara","Milošević","sara.milosevic@mail.com",
                LocalDateTime.now().minusMonths(1), Category.B, TrainingStatus.PRACTICAL, i1,
                "Veternik, Novi Sad", LocalDate.of(2026,5,14), 35, 40, candidateRole));





        //routes


        Route r1 = makeRoute(
                "Poligon Most Slobode - Liman 3 Loop",
                "Starting from the parking poligon near Sunčani Kej, heading along Bulevar Cara Lazara, down Bulevar Despota Stefana and back via Most Slobode junction.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8512,45.2395],[19.8450,45.2410],[19.8410,45.2435],[19.8360,45.2380],[19.8430,45.2350],[19.8512,45.2395]]}"
        );

        Route r2 =makeRoute(
                "Bulevar Evrope Straight & Turning Exercise",
                "Multi-lane boulevard driving focusing on lane changes, traffic lights, and roundabouts near Detelinara.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8120,45.2510],[19.8145,45.2585],[19.8170,45.2660],[19.8250,45.2640],[19.8220,45.2560]]}"
        );

        Route r3 = makeRoute(
                "Novo Naselje - Parallel Parking & Pedestrian Zones",
                "Focus on 30 km/h zones, right-of-way rules without traffic signals, and parallel parking along Bulevar Jovana Dučića.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.7950,45.2520],[19.7990,45.2545],[19.8050,45.2510],[19.8080,45.2560],[19.7980,45.2580]]}"
        );

        Route r4 =makeRoute(
                "Petrovaradin - Varadin Bridge to Fortress Incline",
                "Crossing Varadinski Most, navigating narrow streets in Stari Majur, and practicing hill starts near the Fortress.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8580,45.2540],[19.8630,45.2530],[19.8690,45.2515],[19.8730,45.2480],[19.8680,45.2450]]}"
        );

        Route r5 =makeRoute(
                "Sajmište - Hospital Zone & Futoška Intersection",
                "Complex light signals near Klinički Centar Vojvodine and heavy urban traffic management on Futoška Ulica.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8260,45.2490],[19.8310,45.2520],[19.8250,45.2550],[19.8190,45.2525],[19.8260,45.2490]]}"
        );

        Route r6 =makeRoute(
                "Grbavica - One-Way Street Navigation",
                "Tight spatial maneuvering in Puškinova, Miše Dimitrijevića, and Danila Kiša streets with heavy street parking.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8350,45.2450],[19.8390,45.2470],[19.8330,45.2485],[19.8300,45.2460],[19.8350,45.2450]]}"
        );

        Route r7 =makeRoute(
                "Podbara - Historic District Rules",
                "Driving through narrow historic cobbled roads, low visibility corners, and yield-to-right rules near Gundulićeva.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8480,45.2610],[19.8520,45.2635],[19.8560,45.2600],[19.8510,45.2580],[19.8480,45.2610]]}"
        );

        Route r8 =makeRoute(
                "Železnička Stanica Roundabout & Bulevar Jaše Tomića",
                "Heavy public transport interaction near the bus/train station, large roundabouts, and pedestrian crosswalks.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8290,45.2650],[19.8330,45.2670],[19.8410,45.2630],[19.8380,45.2590],[19.8290,45.2650]]}"
        );

        Route r9 =makeRoute(
                "Most Slobode to Sremska Kamenica Center",
                "Suburban arterial road driving across Most Slobode into Sremska Kamenica, testing higher speed limit transitions.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8450,45.2350],[19.8480,45.2280],[19.8450,45.2220],[19.8410,45.2250],[19.8450,45.2350]]}"
        );

        Route r10 =makeRoute(
                "Salajka - Partizanska Commercial Zone",
                "Industrial traffic practice involving delivery trucks, wide turns, and railway crossings near Partizanska.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8380,45.2680],[19.8450,45.2710],[19.8530,45.2690],[19.8480,45.2650],[19.8380,45.2680]]}"
        );

        Route r11 =makeRoute(
                "Telep - Heroja Pinkija Residential Route",
                "Mixing broad avenues like Bulevar Patrijarha Pavla with narrow suburban streets in Telep.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8050,45.2420],[19.8150,45.2440],[19.8180,45.2390],[19.8080,45.2370],[19.8050,45.2420]]}"
        );

        Route r12 =makeRoute(
                "Klisa - Temerinska Arterial Route",
                "High-volume lane selection, traffic light timing, and dual-carriageway driving towards Klisa.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8450,45.2680],[19.8480,45.2750],[19.8510,45.2830],[19.8440,45.2810],[19.8450,45.2680]]}"
        );

        Route r13 =makeRoute(
                "Univerzitetski Grad - Campus & Sunčani Kej",
                "Low-speed maneuvering near university buildings, high pedestrian density, and cyclists along Dr Zorana Đinđića.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8520,45.2460],[19.8560,45.2480],[19.8510,45.2510],[19.8460,45.2490],[19.8520,45.2460]]}"
        );

        Route r14 =makeRoute(
                "Žeželj Most - Petrovaradin Bypass",
                "Bridge crossing, lane merging at elevated highway ramps, and speed control along Reljkovićeva.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8610,45.2620],[19.8660,45.2590],[19.8720,45.2550],[19.8680,45.2520],[19.8610,45.2620]]}"
        );

        Route r15 =makeRoute(
                "Industrijska Zona Sever - Mall Parking & Roundabouts",
                "Navigating large shopping park entrances, double-lane roundabouts, and heavy retail traffic.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8280,45.2730],[19.8320,45.2780],[19.8390,45.2760],[19.8350,45.2710],[19.8280,45.2730]]}"
        );

        Route r16 =makeRoute(
                "Bulevar Oslobođenja Main Axis",
                "Testing multi-intersection signaling, bus lane awareness, and left turns along the central city artery.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8300,45.2660],[19.8330,45.2600],[19.8380,45.2500],[19.8440,45.2420],[19.8300,45.2660]]}"
        );

        Route r17 =makeRoute(
                "Adice Suburban Outer Test Route",
                "Focus on un-signaled T-intersections, narrow roadway yield situations, and reverse entry turnarounds.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.7820,45.2410],[19.7880,45.2440],[19.7920,45.2390],[19.7850,45.2360],[19.7820,45.2410]]}"
        );

        Route r18 =makeRoute(
                "Futoški Put - Veternik Boundary Route",
                "Straight arterial driving with high-speed transitions (50 to 60+ km/h), traffic light positioning, and U-turns.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8100,45.2510],[19.7950,45.2500],[19.7800,45.2490],[19.7950,45.2500],[19.8100,45.2510]]}"
        );

        Route r19 =makeRoute(
                "Centar - City Administration & Danube Park Loop",
                "Tight urban driving around Izvršno Veće, strict pedestrian priority zones, and standard urban speed limits.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.8460,45.2540],[19.8510,45.2520],[19.8490,45.2480],[19.8430,45.2510],[19.8460,45.2540]]}"
        );

        Route r20 =makeRoute(
                "Veternik - Kružni Tok & Satellite Suburban Roads",
                "Suburban roundabout navigation, merging onto main transit roads, and navigating school zone speed limits.",
                "{\"type\":\"LineString\",\"coordinates\":[[19.7750,45.2520],[19.7820,45.2550],[19.7880,45.2510],[19.7800,45.2480],[19.7750,45.2520]]}"
        );








        //leaves

        InstructorLeaveRequest leave1 = new InstructorLeaveRequest();
        leave1.setInstructor(i2);
        leave1.setStartDate(LocalDate.of(2026, 9, 22));
        leave1.setEndDate(LocalDate.of(2026, 9, 22));
        leave1.setType(LeaveType.PERSONAL);
        leave1.setStatus(LeaveStatus.APPROVED);
        leave1.setReason("Wedding");
        leave1.setAdminComment("Have a good time, approved!");
        leave1.setRequestedAt(LocalDateTime.of(2026, 9, 15, 10, 0));
        leave1.setResolvedAt(LocalDateTime.of(2026, 9, 15, 12, 0));
        instructorLeaveRequestRepository.save(leave1);

        InstructorLeaveRequest leave2 = new InstructorLeaveRequest();
        leave2.setInstructor(i2);
        leave2.setStartDate(LocalDate.of(2026, 12, 10));
        leave2.setEndDate(LocalDate.of(2026, 12, 19));
        leave2.setType(LeaveType.VACATION);
        leave2.setStatus(LeaveStatus.APPROVED);
        leave2.setReason("Annual winter vacation");
        leave2.setAdminComment("Enjoy");
        leave2.setRequestedAt(LocalDateTime.of(2026, 9, 15, 10, 0));
        leave2.setResolvedAt(LocalDateTime.of(2026, 9, 15, 12, 0));
        instructorLeaveRequestRepository.save(leave2);

        InstructorLeaveRequest leave3 = new InstructorLeaveRequest();
        leave3.setInstructor(i1);
        leave3.setStartDate(LocalDate.of(2026, 10, 5));
        leave3.setEndDate(LocalDate.of(2026, 10, 9));
        leave3.setType(LeaveType.VACATION);
        leave3.setStatus(LeaveStatus.APPROVED);
        leave3.setReason("Autumn break");
        leave2.setAdminComment("Approved, enjoy");
        leave3.setRequestedAt(LocalDateTime.of(2026, 9, 15, 10, 0));
        leave3.setResolvedAt(LocalDateTime.of(2026, 9, 15, 12, 0));
        instructorLeaveRequestRepository.save(leave3);



        //exams



        makeExam(martaPesic, a1, LocalDateTime.of(2026, 9, 1, 10, 0), ExamStatus.CANCELLED, null);
        makeExam(martaPesic, a1, LocalDateTime.of(2026, 9, 3, 10, 0), ExamStatus.COMPLETED, 88);

        makeExam(goranJovanovic, a2, LocalDateTime.of(2026, 9, 4, 9, 0), ExamStatus.COMPLETED, 91);

        makeExam(vanjaKrstic, a3, LocalDateTime.of(2026, 9, 5, 11, 0), ExamStatus.FAILED, 32);
        makeExam(vanjaKrstic, a3, LocalDateTime.of(2026, 9, 8, 11, 0), ExamStatus.COMPLETED, 85);

        makeExam(teodoraMilovanovic, a1, LocalDateTime.of(2026, 9, 9, 9, 0), ExamStatus.COMPLETED, 90);

        makeExam(aleksaStamenkovic, a2, LocalDateTime.of(2026, 9, 10, 13, 0), ExamStatus.FAILED, 38);
        makeExam(aleksaStamenkovic, a2, LocalDateTime.of(2026, 9, 12, 13, 0), ExamStatus.COMPLETED, 87);

        makeExam(sofijaRadenkovic, a3, LocalDateTime.of(2026, 9, 15, 10, 0), ExamStatus.COMPLETED, 95);

        makeExam(darioPavkov, a1, LocalDateTime.of(2026, 9, 16, 9, 0), ExamStatus.COMPLETED, 89);

        makeExam(ljubicaRankovic, a2, LocalDateTime.of(2026, 9, 17, 10, 0), ExamStatus.FAILED, 29);
        makeExam(ljubicaRankovic, a2, LocalDateTime.of(2026, 9, 18, 10, 0), ExamStatus.COMPLETED, 84);

        makeExam(nikolaGojkovic, a3, LocalDateTime.of(2026, 9, 19, 9, 0), ExamStatus.COMPLETED, 92);



        makeExam(vukasinJovicic, a1, LocalDateTime.of(2026, 9, 22, 10, 0), ExamStatus.FAILED, 35);
        makeExam(vukasinJovicic, a1, LocalDateTime.of(2026, 9, 26, 10, 0), ExamStatus.SCHEDULED, null);

        makeExam(elenaVukasinovic, a2, LocalDateTime.of(2026, 9, 29, 9, 0), ExamStatus.SCHEDULED, null);

        makeExam(filipKrunic, a3, LocalDateTime.of(2026, 9, 30, 11, 0), ExamStatus.SCHEDULED, null);

        makeExam(jovanaStevic, a1, LocalDateTime.of(2026, 10, 1, 9, 0), ExamStatus.SCHEDULED, null);

        makeExam(aleksandarGavrilovic, a2, LocalDateTime.of(2026, 10, 2, 13, 0), ExamStatus.SCHEDULED, null);

        makeExam(bojanaStefanovic, a3, LocalDateTime.of(2026, 10, 5, 10, 0), ExamStatus.SCHEDULED, null);

        //prefernces for candidate that are practical



        LocalDate weekStart = LocalDate.of(2026, 9, 28); // Monday next week

        double[][] novisadCoords = {
                {45.2395,19.8410},{45.2450,19.8350},{45.2570,19.8150},{45.2520,19.7990},
                {45.2510,19.8630},{45.2420,19.8050},{45.2680,19.8450},{45.2490,19.8260},
                {45.2410,19.7820},{45.2520,19.7750},{45.2510,19.8145},{45.2610,19.8480},
                {45.2680,19.8380},{45.2650,19.8290},{45.2540,19.8460},{45.2620,19.8610},
                {45.2460,19.8520},{45.2730,19.8280},{45.2660,19.8300},{45.2510,19.8100}
        };

        int noPrefCount = 0;
        for (int i = 0; i < practicalCandidates.size(); i++) {
            Candidate c = practicalCandidates.get(i);
            double[] coord = novisadCoords[i % novisadCoords.length];

            // Make exactly 3 candidates NO_PREFERENCE (indices spread out)
            if (i == 5 || i == 15 || i == 25) {
                makePreference(c, weekStart, c.getLocation(), coord[0], coord[1],
                        PreferenceStatus.NO_PREFERENCE, List.of());
                continue;
            }

            List<TimeSlot> slots;
            int pattern = i % 6;
            switch (pattern) {
                case 0 -> slots = List.of( // Monday afternoon
                        new TimeSlot(weekStart, LocalTime.of(14,0), LocalTime.of(17,0))
                );
                case 1 -> slots = List.of( // Tuesday till 12
                        new TimeSlot(weekStart.plusDays(1), LocalTime.of(9,0), LocalTime.of(12,0))
                );
                case 2 -> slots = List.of( // Friday 2 to 8 (14:00-20:00)
                        new TimeSlot(weekStart.plusDays(4), LocalTime.of(14,0), LocalTime.of(20,0))
                );
                case 3 -> slots = List.of( // Wednesday morning + Saturday afternoon
                        new TimeSlot(weekStart.plusDays(2), LocalTime.of(9,0), LocalTime.of(11,0)),
                        new TimeSlot(weekStart.plusDays(5), LocalTime.of(13,0), LocalTime.of(16,0))
                );
                case 4 -> slots = List.of( // Monday evening + Thursday morning
                        new TimeSlot(weekStart, LocalTime.of(17,0), LocalTime.of(20,0)),
                        new TimeSlot(weekStart.plusDays(3), LocalTime.of(8,0), LocalTime.of(10,0))
                );
                default -> slots = List.of( // Tuesday afternoon + Friday morning
                        new TimeSlot(weekStart.plusDays(1), LocalTime.of(13,0), LocalTime.of(16,0)),
                        new TimeSlot(weekStart.plusDays(4), LocalTime.of(9,0), LocalTime.of(11,0))
                );
            }

            makePreference(c, weekStart, c.getLocation(), coord[0], coord[1],
                    PreferenceStatus.SUBMITTED, slots);
        }


        if (practicalClassRepository.count() == 0) {
            createPracticalClasses();
        }


        createVukasinLocationNotes(vukasinJovicic,r1);


        List<Route> allRoutes = routeRepository.findAll();
        List<InstructorLeaveRequest> allLeaves = instructorLeaveRequestRepository.findAll();

        generatePracticalClassesForCandidates(practicalCandidates, allRoutes, allLeaves);
        createManualCurrentWeekClasses( allRoutes);

    }


    private Candidate makeCandidate(String username, String name, String lastname, String email,
                               LocalDateTime startOfTraining, Category category, TrainingStatus status,
                               Instructor instructor, String location, LocalDate theoryPassedDate,
                               Integer numberOfCompletedClasses, Integer totalRequiredClasses,
                               Role candidateRole) {

        Candidate candidate = new Candidate();
        candidate.setUsername(username);
        candidate.setName(name);
        candidate.setLastname(lastname);
        candidate.setEmail(email);
        candidate.setPassword(passwordEncoder.encode("123"));
        candidate.setRole(candidateRole);
        candidate.setCategory(category);
        candidate.setStatus(status);
        candidate.setInstructor(instructor);
        candidate.setLocation(location);
        candidate.setTheoryPassedDate(theoryPassedDate);
        candidate.setStartOfTraining(startOfTraining);
        candidate.setTheoryCompleted(true);
        candidate.setNumberOfCompletedClasses(numberOfCompletedClasses);
        candidate.setTotalRequiredClasses(totalRequiredClasses);
        return candidateRepository.save(candidate);
    }

    private Route makeRoute(String name, String description, String pathGeoJson) {
        Route r = new Route();
        r.setName(name);
        r.setDescription(description);
        r.setPathGeoJson(pathGeoJson);
        return routeRepository.save(r);
    }



    private record TimeSlot(LocalDate date, LocalTime startTime, LocalTime endTime) {}

    private void makePreference(Candidate candidate, LocalDate weekStart, String locationName,
                                Double lat, Double lng, PreferenceStatus status,
                                List<TimeSlot> slots) {
        Preference p = new Preference();
        p.setCreatedAt(LocalDateTime.now().minusDays(2));
        p.setWeekStartDate(weekStart);
        p.setLocationName(locationName);
        p.setPickupLatitude(lat);
        p.setPickupLongitude(lng);
        p.setCandidate(candidate);
        p.setStatus(status);
        preferenceRepository.save(p);

        for (TimeSlot slot : slots) {
            TimePreference tp = new TimePreference();
            tp.setDate(slot.date());
            tp.setStartTime(slot.startTime());
            tp.setEndTime(slot.endTime());
            tp.setPreference(p);
            timePreferenceRepository.save(tp);
        }
    }

    private PracticalExam makeExam(Candidate candidate, Admin admin, LocalDateTime dateTime,
                                   ExamStatus status, Integer score) {
        PracticalExam exam = new PracticalExam();
        exam.setCandidate(candidate);
        exam.setAdmin(admin);
        exam.setDateTime(dateTime);
        exam.setStatus(status);
        exam.setScore(score);
        return practicalExamRepository.save(exam);
    }





    private void createPracticalClasses() {

        List<Candidate> candidates = candidateRepository.findAll().stream()
                .filter(c -> c.getStatus() != TrainingStatus.PRACTICAL)
                .toList();
        List<Instructor> instructors = instructorRepository.findAll();

        if (candidates.isEmpty()) {
            System.out.println("No candidates found. Cannot create practical classes.");
            return;
        }

        if (instructors.isEmpty()) {
            System.out.println("No instructors found. Cannot create practical classes.");
            return;
        }

        List<PracticalClass> allClasses = new ArrayList<>();

        LocalDate startDate = LocalDate.of(2026, 7, 1);
        LocalDate endDate = LocalDate.of(2026, 8, 31);

        List<LocalTime> availableTimes = List.of(
                LocalTime.of(8, 0),
                LocalTime.of(9, 30),
                LocalTime.of(11, 0),
                LocalTime.of(12, 30),
                LocalTime.of(14, 0),
                LocalTime.of(15, 30)
        );

        List<String> locations = List.of(
                "Auto škola - poligon",
                "Centar grada",
                "Bulevar Evrope",
                "Futoški put",
                "Detelinara"
        );

        int instructorStartIndex = 0;

        for (Candidate candidate : candidates) {

            int classNumber = 0;

            LocalDate currentDate = startDate;

            while (
                    classNumber < 40
                            && !currentDate.isAfter(endDate)
            ) {

                boolean isWeekday =
                        currentDate.getDayOfWeek() != DayOfWeek.SATURDAY
                                && currentDate.getDayOfWeek() != DayOfWeek.SUNDAY;


                if (isWeekday) {

                    for (LocalTime startTime : availableTimes) {

                        if (classNumber >= 40) {
                            break;
                        }


                        LocalDateTime scheduledStart =
                                LocalDateTime.of(
                                        currentDate,
                                        startTime
                                );

                        LocalDateTime scheduledEnd =
                                scheduledStart.plusMinutes(90);


                        Instructor instructor =
                        findAvailableInstructor(
                                        instructors,
                                        allClasses,
                                        scheduledStart,
                                        scheduledEnd,
                                        instructorStartIndex
                                );


                        if (instructor == null) {
                            continue;
                        }


                        instructorStartIndex++;

                        if (instructorStartIndex >= instructors.size()) {
                            instructorStartIndex = 0;
                        }

                        PracticalClass practicalClass =
                                new PracticalClass();


                        practicalClass.setCandidate(candidate);
                        practicalClass.setInstructor(instructor);

                        practicalClass.setScheduledStartTime(
                                scheduledStart
                        );

                        practicalClass.setScheduledEndTime(
                                scheduledEnd
                        );

                        int currentClassNumber =
                                classNumber + 1;

                        if (currentClassNumber % 15 == 0) {

                            practicalClass.setClassStatus(
                                    ClassStatus.CANCELLED
                            );

                            practicalClass.setActualStartTime(null);
                            practicalClass.setActualEndTime(null);

                            practicalClass.setGrade(null);

                            practicalClass.setComment(
                                    "Praktični čas je otkazan."
                            );

                            practicalClass.setRemarks(
                                    "Termin je otkazan."
                            );

                        } else if (currentClassNumber % 13 == 0) {

                            practicalClass.setClassStatus(
                                    ClassStatus.BAD_END
                            );

                            practicalClass.setActualStartTime(
                                    scheduledStart
                            );

                            practicalClass.setActualEndTime(
                                    scheduledStart.plusMinutes(45)
                            );

                            practicalClass.setGrade(
                                    getTestGrade(currentClassNumber)
                            );

                            practicalClass.setComment(
                                    "Praktični čas nije uspešno završen."
                            );

                            practicalClass.setRemarks(
                                    "Kandidatu je potrebno dodatno vežbanje."
                            );

                        } else {

                            practicalClass.setClassStatus(
                                    ClassStatus.ENDED
                            );


                            practicalClass.setActualStartTime(
                                    scheduledStart
                            );

                            practicalClass.setActualEndTime(
                                    scheduledEnd
                            );

                            practicalClass.setGrade(
                                    getTestGrade(currentClassNumber)
                            );

                            practicalClass.setComment(
                                    "Praktični čas uspešno završen."
                            );

                            practicalClass.setRemarks(
                                    "Kandidat je odradio planirani čas."
                            );
                        }


                        practicalClass.setInterruptionReason(null);
                        practicalClass.setInterruptionNote(null);

                        practicalClass.setRoute(null);


                        practicalClass.setLocation(
                                locations.get(
                                        classNumber % locations.size()
                                )
                        );

                        allClasses.add(practicalClass);

                        classNumber++;
                    }
                }

                currentDate = currentDate.plusDays(1);
            }

            System.out.println(
                    "Created "
                            + classNumber
                            + " practical classes for candidate "
                            + candidate.getId()
            );

            if (classNumber < 40) {

                System.out.println(
                        "WARNING: Candidate "
                                + candidate.getId()
                                + " received only "
                                + classNumber
                                + " classes."
                );
            }
        }


        practicalClassRepository.saveAll(allClasses);


        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Created "
                        + allClasses.size()
                        + " practical classes."
        );

        System.out.println(
                "Candidates: "
                        + candidates.size()
        );

        System.out.println(
                "Expected: "
                        + candidates.size() * 40
        );

        System.out.println(
                "=========================================="
        );
    }


    private Instructor findAvailableInstructor(
            List<Instructor> instructors,
            List<PracticalClass> existingClasses,
            LocalDateTime newStart,
            LocalDateTime newEnd,
            int startIndex
    ) {

        for (int i = 0; i < instructors.size(); i++) {

            int index =
                    (startIndex + i) % instructors.size();

            Instructor instructor =
                    instructors.get(index);


            boolean overlap = false;


            for (PracticalClass existingClass : existingClasses) {
                if (
                        !existingClass
                                .getInstructor()
                                .getId()
                                .equals(instructor.getId())
                ) {
                    continue;
                }


                LocalDateTime existingStart =
                        existingClass.getScheduledStartTime();

                LocalDateTime existingEnd =
                        existingClass.getScheduledEndTime();


                if (
                        newStart.isBefore(existingEnd)
                                && newEnd.isAfter(existingStart)
                ) {

                    overlap = true;
                    break;
                }
            }


            if (!overlap) {
                return instructor;
            }
        }

        return null;
    }

    private int getTestGrade(int classNumber) {

        return switch (classNumber % 3) {
            case 1 -> 4;
            case 2 -> 5;
            default -> 3;
        };
    }


    private void createVukasinLocationNotes(
            Candidate vukasinJovicic, Route r1
    ) {


        List<PracticalClass> vukasinClasses =
                practicalClassRepository
                        .findAll()
                        .stream()
                        .filter(pc ->
                                pc.getCandidate()
                                        .getId()
                                        .equals(vukasinJovicic.getId())
                        )
                        .sorted(
                                (a, b) ->
                                        a.getScheduledStartTime()
                                                .compareTo(
                                                        b.getScheduledStartTime()
                                                )
                        )
                        .toList();

        if (vukasinClasses.size() < 2) {
            System.out.println(
                    "Vukašin does not have enough practical classes."
            );
            return;
        }
        PracticalClass class39 = vukasinClasses.get(vukasinClasses.size() - 2);

        PracticalClass class40 = vukasinClasses.get(vukasinClasses.size() - 1);


        class40.setRoute(r1);

        LocationNote note39_1 =new LocationNote(class39,45.2671,19.8335,
                        "Kandidat je pokazao dobru kontrolu vozila pri uključivanju u saobraćaj."
                );


        LocationNote note39_2 =new LocationNote(class39,45.2582,19.8339,
                        "Vežbano prestrojavanje i pravilno korišćenje pokazivača pravca."
                );


        LocationNote note39_3 =new LocationNote(class39,45.2508,19.8397,
                        "Kandidat je pravilno reagovao na promenu saobraćajne situacije."
                );



        LocationNote note40_1 =new LocationNote( class40,45.2410,19.8450,
                        "Nije stao na stop znak. Obratiti paznju na nezgodnom je mestu."
                );


        LocationNote note40_2 =new LocationNote(class40, 45.2435, 19.8410,
                        "Nije sacekao da kolona prodje, ljudi jure kao ludi na ovom delu. Stati pazljivije i pogledati"
                );


        LocationNote note40_3 = new LocationNote(class40,45.2350, 19.8430,
                        "Nije video lezeceg policajca, Pratiti znakove bolje!!!!"
                );

        locationNoteRepository.saveAll(
                List.of(
                        note39_1,
                        note39_2,
                        note39_3,
                        note40_1,
                        note40_2,
                        note40_3
                )
        );


        System.out.println(
                "Created 6 location notes for Vukašin Jovičić."
        );
    }


    private void generatePracticalClassesForCandidates(List<Candidate> candidates, List<Route> routes, List<InstructorLeaveRequest> leaves) {
        if (routes == null || routes.isEmpty()) return;

        LocalDate today = LocalDate.now();
        LocalDate currentWeekMonday = today.with(java.time.temporal.TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        for (Candidate candidate : candidates) {
            int totalClassesToGenerate = Math.max(0, candidate.getNumberOfCompletedClasses() - 2);
            if (totalClassesToGenerate == 0) continue;

            Instructor instructor = candidate.getInstructor();

            LocalDateTime currentSlot = candidate.getStartOfTraining() != null
                    ? candidate.getStartOfTraining().withHour(9).withMinute(0)
                    : LocalDateTime.of(2026, 5, 1, 9, 0);

            int generatedCount = 0;
            int safetyFallbackAttempts = 0; // Prevent any potential infinite loops

            while (generatedCount < totalClassesToGenerate && safetyFallbackAttempts < 2000) {
                safetyFallbackAttempts++;

                // Skip Sundays
                if (currentSlot.getDayOfWeek() == DayOfWeek.SUNDAY) {
                    currentSlot = currentSlot.plusDays(1).withHour(9);
                    continue;
                }

                // If we reach or exceed the current week's Monday, wrap around or shift time slots earlier in the day
                if (!currentSlot.toLocalDate().isBefore(currentWeekMonday)) {
                    // Instead of looping infinitely, jump back to May and try evening/alternate slots
                    currentSlot = LocalDateTime.of(2026, 5, 1, 8, 0).plusDays(generatedCount * 2L);
                    continue;
                }

                LocalDateTime scheduledEnd = currentSlot.plusMinutes(90);
                Long currentInstructorId = instructor.getId();
                final LocalDateTime slotForCheck = currentSlot;

                boolean isOnLeave = leaves.stream().anyMatch(leave ->
                        leave.getInstructor().getId().equals(currentInstructorId) &&
                                !slotForCheck.toLocalDate().isBefore(leave.getStartDate()) &&
                                !slotForCheck.toLocalDate().isAfter(leave.getEndDate())
                );

                boolean isInstructorBusy = practicalClassRepository.existsByInstructorAndScheduledStartTimeLessThanAndScheduledEndTimeGreaterThan(
                        instructor, scheduledEnd, currentSlot
                );

                if (!isOnLeave && !isInstructorBusy) {
                    PracticalClass pClass = new PracticalClass();
                    pClass.setCandidate(candidate);
                    pClass.setInstructor(instructor);
                    pClass.setScheduledStartTime(currentSlot);
                    pClass.setScheduledEndTime(scheduledEnd);
                    pClass.setActualStartTime(currentSlot);
                    pClass.setActualEndTime(scheduledEnd);
                    pClass.setClassStatus(ClassStatus.ENDED);

                    Route assignedRoute = routes.get((int) (Math.random() * routes.size()));
                    pClass.setRoute(assignedRoute);

                    pClass.setGrade(2 + (int)(Math.random() * 4));
                    pClass.setComment("Redovna praktična obuka - čas #" + (generatedCount + 1));
                    pClass.setRemarks("Uspesno savladane deonice.");
                    pClass.setLocation(candidate.getStartOfTraining() != null ? "Novi Sad Zona" : "Centar");

                    practicalClassRepository.save(pClass);
                    generatedCount++;

                    // Move forward by 2 days for the next class
                    currentSlot = currentSlot.plusDays(2);
                } else {
                    // If busy, shift forward by 2 hours to find the next available slot on the same or next day
                    currentSlot = currentSlot.plusHours(2);
                    if (currentSlot.getHour() > 18) {
                        currentSlot = currentSlot.plusDays(1).withHour(9);
                    }
                }
            }

            if (generatedCount < totalClassesToGenerate) {
                System.out.println("WARNING: Could only generate " + generatedCount + " of " + totalClassesToGenerate + " classes for " + candidate.getName() + " due to heavy schedule conflicts.");
            }
        }
    }





   /* private void createManualCurrentWeekClasses(List<Route> routes) {
        if (routes == null || routes.isEmpty()) return;

        LocalDate monday = LocalDate.of(2026, 9, 14);
        LocalDate tuesday = monday.plusDays(1);
        LocalDate wednesday = monday.plusDays(2);
        LocalDate thursday = monday.plusDays(3);
        LocalDate friday = monday.plusDays(4);
        LocalDate saturday = monday.plusDays(5);

        // Fetch candidates directly by their exact email addresses
        Candidate tanja      = candidateRepository.findByEmail("tanjac@mail.com");
        Candidate lena       = candidateRepository.findByEmail("lena.reljic@mail.com");
        Candidate saraJ      = candidateRepository.findByEmail("sara.janjic@mail.com");
        Candidate petar      = candidateRepository.findByEmail("petar.ristic@mail.com");
        Candidate aleksandra = candidateRepository.findByEmail("aleksandra.begovic@mail.com");
        Candidate milos      = candidateRepository.findByEmail("milos.zivkovic@mail.com");
        Candidate tamara     = candidateRepository.findByEmail("tamara.vukovic@mail.com");
        Candidate saraM      = candidateRepository.findByEmail("sara.milosevic@mail.com");
        Candidate luka       = candidateRepository.findByEmail("luka.antic@mail.com");
        Candidate ivana      = candidateRepository.findByEmail("ivana.maric@mail.com");
        Candidate saraS      = candidateRepository.findByEmail("sara.sapun@mail.com");

        List<PracticalClass> manualClasses = new ArrayList<>();

        // Helper block to build and add a class
        // (We write out standard helper logic or instantiate directly)

        // --- MONDAY ---
        if (tanja != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(tanja);
            c.setInstructor(tanja.getInstructor());
            c.setScheduledStartTime(monday.atTime(8, 0));
            c.setScheduledEndTime(monday.atTime(9, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(0));
            c.setLocation(tanja.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (lena != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(lena);
            c.setInstructor(lena.getInstructor());
            c.setScheduledStartTime(monday.atTime(9, 30));
            c.setScheduledEndTime(monday.atTime(11, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(1));
            c.setLocation(lena.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (saraJ != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(saraJ);
            c.setInstructor(saraJ.getInstructor());
            c.setScheduledStartTime(monday.atTime(11, 0));
            c.setScheduledEndTime(monday.atTime(12, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(2));
            c.setLocation(saraJ.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (petar != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(petar);
            c.setInstructor(petar.getInstructor());
            c.setScheduledStartTime(monday.atTime(16, 0));
            c.setScheduledEndTime(monday.atTime(17, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(3));
            c.setLocation(petar.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- TUESDAY ---
        if (aleksandra != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(aleksandra);
            c.setInstructor(aleksandra.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(7, 0));
            c.setScheduledEndTime(tuesday.atTime(8, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(4));
            c.setLocation(aleksandra.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (milos != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(milos);
            c.setInstructor(milos.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(9, 0));
            c.setScheduledEndTime(tuesday.atTime(10, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(5));
            c.setLocation(milos.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (tamara != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(tamara);
            c.setInstructor(tamara.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(10, 30));
            c.setScheduledEndTime(tuesday.atTime(12, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(6));
            c.setLocation(tamara.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (saraM != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(saraM);
            c.setInstructor(saraM.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(14, 0));
            c.setScheduledEndTime(tuesday.atTime(15, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(7));
            c.setLocation(saraM.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- WEDNESDAY ---
        if (luka != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(luka);
            c.setInstructor(luka.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(9, 0));
            c.setScheduledEndTime(wednesday.atTime(10, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(8));
            c.setLocation(luka.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (saraM != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(saraM);
            c.setInstructor(saraM.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(10, 30));
            c.setScheduledEndTime(wednesday.atTime(12, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(9));
            c.setLocation(saraM.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (ivana != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(ivana);
            c.setInstructor(ivana.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(12, 0));
            c.setScheduledEndTime(wednesday.atTime(13, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(10));
            c.setLocation(ivana.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (saraS != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(saraS);
            c.setInstructor(saraS.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(17, 0));
            c.setScheduledEndTime(wednesday.atTime(18, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(11));
            c.setLocation(saraS.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- THURSDAY ---
        if (aleksandra != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(aleksandra);
            c.setInstructor(aleksandra.getInstructor());
            c.setScheduledStartTime(thursday.atTime(7, 0));
            c.setScheduledEndTime(thursday.atTime(8, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(12));
            c.setLocation(aleksandra.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (petar != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(petar);
            c.setInstructor(petar.getInstructor());
            c.setScheduledStartTime(thursday.atTime(10, 0));
            c.setScheduledEndTime(thursday.atTime(11, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(13));
            c.setLocation(petar.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (luka != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(luka);
            c.setInstructor(luka.getInstructor());
            c.setScheduledStartTime(thursday.atTime(14, 30));
            c.setScheduledEndTime(thursday.atTime(16, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(14));
            c.setLocation(luka.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (tanja != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(tanja);
            c.setInstructor(tanja.getInstructor());
            c.setScheduledStartTime(thursday.atTime(16, 0));
            c.setScheduledEndTime(thursday.atTime(17, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(15));
            c.setLocation(tanja.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- FRIDAY ---
        if (ivana != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(ivana);
            c.setInstructor(ivana.getInstructor());
            c.setScheduledStartTime(friday.atTime(8, 0));
            c.setScheduledEndTime(friday.atTime(9, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(16));
            c.setLocation(ivana.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (lena != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(lena);
            c.setInstructor(lena.getInstructor());
            c.setScheduledStartTime(friday.atTime(12, 0));
            c.setScheduledEndTime(friday.atTime(13, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(17));
            c.setLocation(lena.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (saraJ != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(saraJ);
            c.setInstructor(saraJ.getInstructor());
            c.setScheduledStartTime(friday.atTime(14, 0));
            c.setScheduledEndTime(friday.atTime(15, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(18));
            c.setLocation(saraJ.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- SATURDAY ---
        if (saraS != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(saraS);
            c.setInstructor(saraS.getInstructor());
            c.setScheduledStartTime(saturday.atTime(7, 0));
            c.setScheduledEndTime(saturday.atTime(8, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(19));
            c.setLocation(saraS.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (milos != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(milos);
            c.setInstructor(milos.getInstructor());
            c.setScheduledStartTime(saturday.atTime(8, 30));
            c.setScheduledEndTime(saturday.atTime(10, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(0));
            c.setLocation(milos.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (tamara != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(tamara);
            c.setInstructor(tamara.getInstructor());
            c.setScheduledStartTime(saturday.atTime(10, 30));
            c.setScheduledEndTime(saturday.atTime(12, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(1));
            c.setLocation(tamara.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }



        Candidate stefan    = candidateRepository.findByEmail("stefan.radovanovic@mail.com");
        Candidate marijaS   = candidateRepository.findByEmail("marija.stankovic@mail.com");
        Candidate aleksaM   = candidateRepository.findByEmail("aleksa.milic@mail.com");
        Candidate jovana    = candidateRepository.findByEmail("jovana.petrovic@mail.com");
        Candidate dario     = candidateRepository.findByEmail("dario.ninkovic@mail.com");
        Candidate milica    = candidateRepository.findByEmail("milica.jaksic@mail.com");
        Candidate bogdan    = candidateRepository.findByEmail("bogdan.trifunovic@mail.com");
        Candidate nina      = candidateRepository.findByEmail("nina.lukic@mail.com");
        Candidate vuk       = candidateRepository.findByEmail("vuk.spasojevic@mail.com");
        Candidate katarina  = candidateRepository.findByEmail("katarina.blagojevic@mail.com");
        Candidate nemanja   = candidateRepository.findByEmail("nemanja.gavric@mail.com");



        // --- MONDAY ---
        if (stefan != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(stefan);
            c.setInstructor(stefan.getInstructor());
            c.setScheduledStartTime(monday.atTime(8, 0));
            c.setScheduledEndTime(monday.atTime(9, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(0));
            c.setLocation(stefan.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (marijaS != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(marijaS);
            c.setInstructor(marijaS.getInstructor());
            c.setScheduledStartTime(monday.atTime(9, 30));
            c.setScheduledEndTime(monday.atTime(11, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(1));
            c.setLocation(marijaS.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (aleksaM != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(aleksaM);
            c.setInstructor(aleksaM.getInstructor());
            c.setScheduledStartTime(monday.atTime(11, 0));
            c.setScheduledEndTime(monday.atTime(12, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(2));
            c.setLocation(aleksaM.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (jovana != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(jovana);
            c.setInstructor(jovana.getInstructor());
            c.setScheduledStartTime(monday.atTime(16, 0));
            c.setScheduledEndTime(monday.atTime(17, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(3));
            c.setLocation(jovana.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- TUESDAY ---
        if (dario != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(dario);
            c.setInstructor(dario.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(7, 0));
            c.setScheduledEndTime(tuesday.atTime(8, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(4));
            c.setLocation(dario.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (milica != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(milica);
            c.setInstructor(milica.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(9, 0));
            c.setScheduledEndTime(tuesday.atTime(10, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(5));
            c.setLocation(milica.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (bogdan != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(bogdan);
            c.setInstructor(bogdan.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(10, 30));
            c.setScheduledEndTime(tuesday.atTime(12, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(6));
            c.setLocation(bogdan.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (nina != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(nina);
            c.setInstructor(nina.getInstructor());
            c.setScheduledStartTime(tuesday.atTime(14, 0));
            c.setScheduledEndTime(tuesday.atTime(15, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(7));
            c.setLocation(nina.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- WEDNESDAY ---
        if (vuk != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(vuk);
            c.setInstructor(vuk.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(9, 0));
            c.setScheduledEndTime(wednesday.atTime(10, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(8));
            c.setLocation(vuk.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (nina != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(nina);
            c.setInstructor(nina.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(10, 30));
            c.setScheduledEndTime(wednesday.atTime(12, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(9));
            c.setLocation(nina.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (katarina != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(katarina);
            c.setInstructor(katarina.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(12, 0));
            c.setScheduledEndTime(wednesday.atTime(13, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(10));
            c.setLocation(katarina.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (nemanja != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(nemanja);
            c.setInstructor(nemanja.getInstructor());
            c.setScheduledStartTime(wednesday.atTime(17, 0));
            c.setScheduledEndTime(wednesday.atTime(18, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(11));
            c.setLocation(nemanja.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- THURSDAY ---
        if (dario != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(dario);
            c.setInstructor(dario.getInstructor());
            c.setScheduledStartTime(thursday.atTime(7, 0));
            c.setScheduledEndTime(thursday.atTime(8, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(12));
            c.setLocation(dario.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (jovana != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(jovana);
            c.setInstructor(jovana.getInstructor());
            c.setScheduledStartTime(thursday.atTime(10, 0));
            c.setScheduledEndTime(thursday.atTime(11, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(13));
            c.setLocation(jovana.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (vuk != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(vuk);
            c.setInstructor(vuk.getInstructor());
            c.setScheduledStartTime(thursday.atTime(14, 30));
            c.setScheduledEndTime(thursday.atTime(16, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(14));
            c.setLocation(vuk.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (stefan != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(stefan);
            c.setInstructor(stefan.getInstructor());
            c.setScheduledStartTime(thursday.atTime(16, 0));
            c.setScheduledEndTime(thursday.atTime(17, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(15));
            c.setLocation(stefan.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- FRIDAY ---
        if (katarina != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(katarina);
            c.setInstructor(katarina.getInstructor());
            c.setScheduledStartTime(friday.atTime(8, 0));
            c.setScheduledEndTime(friday.atTime(9, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(16));
            c.setLocation(katarina.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (marijaS != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(marijaS);
            c.setInstructor(marijaS.getInstructor());
            c.setScheduledStartTime(friday.atTime(12, 0));
            c.setScheduledEndTime(friday.atTime(13, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(17));
            c.setLocation(marijaS.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (aleksaM != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(aleksaM);
            c.setInstructor(aleksaM.getInstructor());
            c.setScheduledStartTime(friday.atTime(14, 0));
            c.setScheduledEndTime(friday.atTime(15, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(18));
            c.setLocation(aleksaM.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        // --- SATURDAY ---
        if (nemanja != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(nemanja);
            c.setInstructor(nemanja.getInstructor());
            c.setScheduledStartTime(saturday.atTime(7, 0));
            c.setScheduledEndTime(saturday.atTime(8, 30));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(19));
            c.setLocation(nemanja.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (milica != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(milica);
            c.setInstructor(milica.getInstructor());
            c.setScheduledStartTime(saturday.atTime(8, 30));
            c.setScheduledEndTime(saturday.atTime(10, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(0));
            c.setLocation(milica.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        if (bogdan != null) {
            PracticalClass c = new PracticalClass();
            c.setCandidate(bogdan);
            c.setInstructor(bogdan.getInstructor());
            c.setScheduledStartTime(saturday.atTime(10, 30));
            c.setScheduledEndTime(saturday.atTime(12, 0));
            c.setClassStatus(ClassStatus.ACCEPTED);
            c.setRoute(routes.get(1));
            c.setLocation(bogdan.getLocation());
            c.setComment("Nedeljni raspored");
            manualClasses.add(c);
        }

        practicalClassRepository.saveAll(manualClasses);
        System.out.println("Successfully saved all " + manualClasses.size() + " manual current-week classes!");
    }*/

    private void createManualCurrentWeekClasses(List<Route> routes) {
        if (routes == null || routes.isEmpty()) return;

        LocalDate monday = LocalDate.of(2026, 9, 21);
        LocalDate tuesday = monday.plusDays(1);
        LocalDate wednesday = monday.plusDays(2);
        LocalDate thursday = monday.plusDays(3);
        LocalDate friday = monday.plusDays(4);
        LocalDate saturday = monday.plusDays(5);

       
        LocalDateTime nowCutoff = LocalDateTime.of(2026, 9, 22, 19, 28);

        // Helper method to build and configure a class with past/future logic
        java.util.function.BiConsumer<Candidate, LocalDateTime[]> addClass = (candidate, timeSlot) -> {
            if (candidate == null) return;

            if(candidate.getEmail().equals("petar.ristic@mail.com") ){
                candidate.setNumberOfCompletedClasses(39);
                candidateRepository.save(candidate);
            }
            PracticalClass c = new PracticalClass();
            c.setCandidate(candidate);
            c.setInstructor(candidate.getInstructor());
            c.setScheduledStartTime(timeSlot[0]);
            c.setScheduledEndTime(timeSlot[1]);
            c.setRoute(routes.get((int) (Math.random() * routes.size())));
            c.setLocation(candidate.getLocation() != null ? candidate.getLocation() : "Centar, Novi Sad");

            // If the class starts before Tuesday 19:28 PM, mark it as completed/ended with grade & comments
            if (timeSlot[0].isBefore(nowCutoff)) {
                c.setClassStatus(ClassStatus.ENDED);
                c.setActualStartTime(timeSlot[0]);
                c.setActualEndTime(timeSlot[1]);
                c.setGrade(2 + (int)(Math.random() * 4)); // Random grade between 2 and 5
                c.setComment("Čas uspešno završen u prethodnom terminu.");
                c.setRemarks("Kandidat je uspešno savladao planirane zadatke.");
            } else {
                // Future or ongoing classes
                c.setClassStatus(ClassStatus.ACCEPTED);
                c.setComment("Nedeljni raspored");
                c.setRemarks("Redovan čas vožnje.");
            }

            practicalClassRepository.save(c);
        };

        // Fetch candidates directly by their exact email addresses
        Candidate tanja      = candidateRepository.findByEmail("tanjac@mail.com");
        Candidate lena       = candidateRepository.findByEmail("lena.reljic@mail.com");
        Candidate saraJ      = candidateRepository.findByEmail("sara.janjic@mail.com");
        Candidate petar      = candidateRepository.findByEmail("petar.ristic@mail.com");
        Candidate aleksandra = candidateRepository.findByEmail("aleksandra.begovic@mail.com");
        Candidate milos      = candidateRepository.findByEmail("milos.zivkovic@mail.com");
        Candidate tamara     = candidateRepository.findByEmail("tamara.vukovic@mail.com");
        Candidate saraM      = candidateRepository.findByEmail("sara.milosevic@mail.com");
        Candidate luka       = candidateRepository.findByEmail("luka.antic@mail.com");
        Candidate ivana      = candidateRepository.findByEmail("ivana.maric@mail.com");
        Candidate saraS      = candidateRepository.findByEmail("sara.sapun@mail.com");

        // --- MONDAY ---
        addClass.accept(tanja, new LocalDateTime[]{ monday.atTime(8, 0), monday.atTime(9, 30) });
        addClass.accept(lena, new LocalDateTime[]{ monday.atTime(9, 30), monday.atTime(11, 0) });
        addClass.accept(saraJ, new LocalDateTime[]{ monday.atTime(11, 0), monday.atTime(12, 30) });
        addClass.accept(petar, new LocalDateTime[]{ monday.atTime(16, 0), monday.atTime(17, 30) });

        // --- TUESDAY ---
        addClass.accept(aleksandra, new LocalDateTime[]{ tuesday.atTime(7, 0), tuesday.atTime(8, 30) });
        addClass.accept(milos, new LocalDateTime[]{ tuesday.atTime(9, 0), tuesday.atTime(10, 30) });
        addClass.accept(tamara, new LocalDateTime[]{ tuesday.atTime(10, 30), tuesday.atTime(12, 0) });
        addClass.accept(saraM, new LocalDateTime[]{ tuesday.atTime(14, 0), tuesday.atTime(15, 30) });

        // --- WEDNESDAY ---
        addClass.accept(luka, new LocalDateTime[]{ wednesday.atTime(9, 0), wednesday.atTime(10, 30) });
        addClass.accept(saraM, new LocalDateTime[]{ wednesday.atTime(10, 30), wednesday.atTime(12, 0) });
        addClass.accept(ivana, new LocalDateTime[]{ wednesday.atTime(12, 0), wednesday.atTime(13, 30) });
        addClass.accept(saraS, new LocalDateTime[]{ wednesday.atTime(17, 0), wednesday.atTime(18, 30) });

        // --- THURSDAY ---
        addClass.accept(aleksandra, new LocalDateTime[]{ thursday.atTime(7, 0), thursday.atTime(8, 30) });
        addClass.accept(petar, new LocalDateTime[]{ thursday.atTime(10, 0), thursday.atTime(11, 30) });
        addClass.accept(luka, new LocalDateTime[]{ thursday.atTime(14, 30), thursday.atTime(16, 0) });
        addClass.accept(tanja, new LocalDateTime[]{ thursday.atTime(16, 0), thursday.atTime(17, 30) });

        // --- FRIDAY ---
        addClass.accept(ivana, new LocalDateTime[]{ friday.atTime(8, 0), friday.atTime(9, 30) });
        addClass.accept(lena, new LocalDateTime[]{ friday.atTime(12, 0), friday.atTime(13, 30) });
        addClass.accept(saraJ, new LocalDateTime[]{ friday.atTime(14, 0), friday.atTime(15, 30) });

        // --- SATURDAY ---
        addClass.accept(saraS, new LocalDateTime[]{ saturday.atTime(7, 0), saturday.atTime(8, 30) });
        addClass.accept(milos, new LocalDateTime[]{ saturday.atTime(8, 30), saturday.atTime(10, 0) });
        addClass.accept(tamara, new LocalDateTime[]{ saturday.atTime(10, 30), saturday.atTime(12, 0) });



        Candidate stefan    = candidateRepository.findByEmail("stefan.radovanovic@mail.com");
        Candidate marijaS   = candidateRepository.findByEmail("marija.stankovic@mail.com");
        Candidate aleksaM   = candidateRepository.findByEmail("aleksa.milic@mail.com");
        Candidate jovana    = candidateRepository.findByEmail("jovana.petrovic@mail.com");
        Candidate dario     = candidateRepository.findByEmail("dario.ninkovic@mail.com");
        Candidate milica    = candidateRepository.findByEmail("milica.jaksic@mail.com");
        Candidate bogdan    = candidateRepository.findByEmail("bogdan.trifunovic@mail.com");
        Candidate nina      = candidateRepository.findByEmail("nina.lukic@mail.com");
        Candidate vuk       = candidateRepository.findByEmail("vuk.spasojevic@mail.com");
        Candidate katarina  = candidateRepository.findByEmail("katarina.blagojevic@mail.com");
        Candidate nemanja   = candidateRepository.findByEmail("nemanja.gavric@mail.com");

        // --- MONDAY (i2) ---
        addClass.accept(stefan, new LocalDateTime[]{ monday.atTime(8, 0), monday.atTime(9, 30) });
        addClass.accept(marijaS, new LocalDateTime[]{ monday.atTime(9, 30), monday.atTime(11, 0) });
        addClass.accept(aleksaM, new LocalDateTime[]{ monday.atTime(11, 0), monday.atTime(12, 30) });
        addClass.accept(jovana, new LocalDateTime[]{ monday.atTime(16, 0), monday.atTime(17, 30) });

        // --- TUESDAY (i2) ---
        addClass.accept(dario, new LocalDateTime[]{ tuesday.atTime(7, 0), tuesday.atTime(8, 30) });
        addClass.accept(milica, new LocalDateTime[]{ tuesday.atTime(9, 0), tuesday.atTime(10, 30) });
        addClass.accept(bogdan, new LocalDateTime[]{ tuesday.atTime(10, 30), tuesday.atTime(12, 0) });
        addClass.accept(nina, new LocalDateTime[]{ tuesday.atTime(14, 0), tuesday.atTime(15, 30) });

        // --- WEDNESDAY (i2) ---
        addClass.accept(vuk, new LocalDateTime[]{ wednesday.atTime(9, 0), wednesday.atTime(10, 30) });
        addClass.accept(nina, new LocalDateTime[]{ wednesday.atTime(10, 30), wednesday.atTime(12, 0) });
        addClass.accept(katarina, new LocalDateTime[]{ wednesday.atTime(12, 0), wednesday.atTime(13, 30) });
        addClass.accept(nemanja, new LocalDateTime[]{ wednesday.atTime(17, 0), wednesday.atTime(18, 30) });

        // --- THURSDAY (i2) ---
        addClass.accept(dario, new LocalDateTime[]{ thursday.atTime(7, 0), thursday.atTime(8, 30) });
        addClass.accept(jovana, new LocalDateTime[]{ thursday.atTime(10, 0), thursday.atTime(11, 30) });
        addClass.accept(vuk, new LocalDateTime[]{ thursday.atTime(14, 30), thursday.atTime(16, 0) });
        addClass.accept(stefan, new LocalDateTime[]{ thursday.atTime(16, 0), thursday.atTime(17, 30) });

        // --- FRIDAY (i2) ---
        addClass.accept(katarina, new LocalDateTime[]{ friday.atTime(8, 0), friday.atTime(9, 30) });
        addClass.accept(marijaS, new LocalDateTime[]{ friday.atTime(12, 0), friday.atTime(13, 30) });
        addClass.accept(aleksaM, new LocalDateTime[]{ friday.atTime(14, 0), friday.atTime(15, 30) });

        // --- SATURDAY (i2) ---
        addClass.accept(nemanja, new LocalDateTime[]{ saturday.atTime(7, 0), saturday.atTime(8, 30) });
        addClass.accept(milica, new LocalDateTime[]{ saturday.atTime(8, 30), saturday.atTime(10, 0) });
        addClass.accept(bogdan, new LocalDateTime[]{ saturday.atTime(10, 30), saturday.atTime(12, 0) });

        System.out.println("Successfully created all manual current-week classes with past/future status applied!");
    }
}
