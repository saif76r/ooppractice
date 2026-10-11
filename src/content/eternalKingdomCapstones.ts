export interface CapstoneStageSpec {
  stageNumber: number;
  title: string;
  topic: string;
  lineCountBadge: string;
  problemStatement: string;
  rejectionRules: string[];
  oopPillars: string[];
  tasks: string[];
  expectedOutput: string;
  fullProjectCode: string;
  skeletonCode: string;
}

// ============================================================================
// PROJECT 1: SMART UNIVERSITY EXAMINATION & COURSE MANAGEMENT SYSTEM (~620 LINES)
// ============================================================================
export const STAGE_1_UNIVERSITY_CODE = `import java.util.*;

// ============================================================================
// PROJECT 1: SMART UNIVERSITY EXAMINATION & COURSE MANAGEMENT SYSTEM
// Full Java OOP Project (~620 Lines)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. CUSTOM EXCEPTIONS (REGISTRATION & EXAM SUBMISSION REJECTION RULES)
// ----------------------------------------------------------------------------

class CreditLimitExceededException extends Exception {
    public CreditLimitExceededException(String message) {
        super(message);
    }
}

class CourseFullException extends Exception {
    public CourseFullException(String message) {
        super(message);
    }
}

class UnpaidFeeException extends Exception {
    public UnpaidFeeException(String message) {
        super(message);
    }
}

class RegistrationDeadlinePassedException extends Exception {
    public RegistrationDeadlinePassedException(String message) {
        super(message);
    }
}

class UnregisteredCourseExamException extends Exception {
    public UnregisteredCourseExamException(String message) {
        super(message);
    }
}

class ExamTimeExpiredException extends Exception {
    public ExamTimeExpiredException(String message) {
        super(message);
    }
}

class DuplicateExamSubmissionException extends Exception {
    public DuplicateExamSubmissionException(String message) {
        super(message);
    }
}

// ----------------------------------------------------------------------------
// 2. INTERFACES (ONLINE EXAM OPERATIONS & PAYMENT METHODS)
// ----------------------------------------------------------------------------

interface OnlineExaminable {
    void login(String portalUser);
    void startExam(String examTitle);
    void submitExam(String examTitle);
}

interface PaymentMethod {
    String getMethodName();
    String processPayment(String studentName, double amount);
}

// ----------------------------------------------------------------------------
// 3. PAYMENT METHOD CLASSES (CASH, CREDIT CARD, MOBILE BANKING)
// ----------------------------------------------------------------------------

class CashPayment implements PaymentMethod {
    private String receiptNo;

    public CashPayment(String receiptNo) {
        this.receiptNo = receiptNo;
    }

    @Override
    public String getMethodName() {
        return "Cash";
    }

    @Override
    public String processPayment(String studentName, double amount) {
        return "[Cash] " + studentName + " paid BDT " + amount
            + " at Cash Counter (Receipt: " + receiptNo + ")";
    }
}

class CreditCardPayment implements PaymentMethod {
    private String cardNumber;
    private String bankName;

    public CreditCardPayment(String cardNumber, String bankName) {
        this.cardNumber = cardNumber;
        this.bankName = bankName;
    }

    @Override
    public String getMethodName() {
        return "Credit Card";
    }

    @Override
    public String processPayment(String studentName, double amount) {
        double charge = amount * 0.02;
        double total = amount + charge;
        return "[CreditCard] " + studentName + " paid BDT " + total
            + " (with 2% fee) via " + bankName + " Card " + cardNumber;
    }
}

class MobileBankingPayment implements PaymentMethod {
    private String appName;
    private String mobileNumber;

    public MobileBankingPayment(String appName, String mobileNumber) {
        this.appName = appName;
        this.mobileNumber = mobileNumber;
    }

    @Override
    public String getMethodName() {
        return "Mobile Banking";
    }

    @Override
    public String processPayment(String studentName, double amount) {
        double cashback = amount * 0.01;
        double netPaid = amount - cashback;
        return "[MobileBanking] " + studentName + " paid BDT " + netPaid
            + " (after 1% cashback) via " + appName + " " + mobileNumber;
    }
}

// ----------------------------------------------------------------------------
// 4. TEACHER & DEPARTMENT (AGGREGATION — INDEPENDENT LIFECYCLE)
// ----------------------------------------------------------------------------

class Teacher {
    private String teacherId;
    private String name;
    private String designation;
    private String currentDeptCode;

    public Teacher(String teacherId, String name, String designation) {
        this.teacherId = teacherId;
        this.name = name;
        this.designation = designation;
        this.currentDeptCode = "NONE";
    }

    public String getTeacherId() {
        return teacherId;
    }

    public String getName() {
        return name;
    }

    public String getDesignation() {
        return designation;
    }

    public String getCurrentDeptCode() {
        return currentDeptCode;
    }

    public void setCurrentDeptCode(String deptCode) {
        this.currentDeptCode = deptCode;
    }

    public String getInfo() {
        return teacherId + ": " + name + " (" + designation + ") - Dept: " + currentDeptCode;
    }
}

class Department {
    private String deptCode;
    private String deptName;
    private List<Teacher> teachers;
    private List<Course> courses;

    public Department(String deptCode, String deptName) {
        this.deptCode = deptCode;
        this.deptName = deptName;
        this.teachers = new ArrayList<>();
        this.courses = new ArrayList<>();
    }

    public String getDeptCode() {
        return deptCode;
    }

    public String getDeptName() {
        return deptName;
    }

    // Aggregation: Teacher exists independently and can be added or transferred
    public void addTeacher(Teacher teacher) {
        if (!teachers.contains(teacher)) {
            teachers.add(teacher);
            teacher.setCurrentDeptCode(this.deptCode);
        }
    }

    public void removeTeacher(Teacher teacher) {
        if (teachers.remove(teacher)) {
            teacher.setCurrentDeptCode("NONE");
        }
    }

    public void transferTeacherTo(Teacher teacher, Department newDept) {
        this.removeTeacher(teacher);
        newDept.addTeacher(teacher);
        System.out.println("[Transfer] " + teacher.getName() + " transferred from "
            + this.deptCode + " to " + newDept.getDeptCode());
    }

    public void addCourse(Course course) {
        if (!courses.contains(course)) {
            courses.add(course);
        }
    }
}

// ----------------------------------------------------------------------------
// 5. STUDENT HIERARCHY (ENCAPSULATION, INHERITANCE & POLYMORPHISM)
// ----------------------------------------------------------------------------

abstract class Student implements OnlineExaminable {
    private String studentId;
    private String name;
    private String email;
    private double cgpa;
    private int currentCreditLoad;
    private int maxCreditLimit;
    private boolean feePaid;
    private boolean loggedIn;
    private List<CourseRegistration> registrations;

    public Student(String studentId, String name, String email, double cgpa, int maxCreditLimit) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.currentCreditLoad = 0;
        this.maxCreditLimit = maxCreditLimit;
        this.feePaid = false;
        this.loggedIn = false;
        this.registrations = new ArrayList<>();
        setCgpa(cgpa);
    }

    // CGPA must remain between 0.00 and 4.00
    public void setCgpa(double newCgpa) {
        if (newCgpa < 0.0 || newCgpa > 4.0) {
            System.out.println("[Validation] Invalid CGPA " + newCgpa + " for " + name + ". Must be between 0.00 and 4.00.");
            return;
        }
        this.cgpa = newCgpa;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public double getCgpa() {
        return cgpa;
    }

    public int getCurrentCreditLoad() {
        return currentCreditLoad;
    }

    public int getMaxCreditLimit() {
        return maxCreditLimit;
    }

    public boolean isFeePaid() {
        return feePaid;
    }

    public void addCredits(int credits) {
        this.currentCreditLoad += credits;
    }

    public void addRegistration(CourseRegistration reg) {
        this.registrations.add(reg);
    }

    public void payFee(PaymentMethod method, double amount) {
        String receipt = method.processPayment(this.name, amount);
        this.feePaid = true;
        System.out.println(receipt);
    }

    @Override
    public void login(String portalUser) {
        this.loggedIn = true;
        System.out.println("[OnlinePortal] " + name + " (" + portalUser + ") logged in.");
    }

    @Override
    public void startExam(String examTitle) {
        if (!loggedIn) {
            System.out.println("[OnlinePortal] Please log in first!");
            return;
        }
        System.out.println("[OnlinePortal] " + name + " started online exam: " + examTitle);
    }

    @Override
    public void submitExam(String examTitle) {
        System.out.println("[OnlinePortal] " + name + " submitted answers for: " + examTitle);
    }

    public abstract String getCategory();
    public abstract double calculateSemesterFee();
}

class RegularStudent extends Student {
    private double perCreditFee;
    private double labFee;

    public RegularStudent(String id, String name, String email, double cgpa, int maxCredit, double perCreditFee, double labFee) {
        super(id, name, email, cgpa, maxCredit);
        this.perCreditFee = perCreditFee;
        this.labFee = labFee;
    }

    @Override
    public String getCategory() {
        return "RegularStudent";
    }

    @Override
    public double calculateSemesterFee() {
        return (getCurrentCreditLoad() * perCreditFee) + labFee;
    }
}

class ScholarshipStudent extends Student {
    private double perCreditFee;
    private double discountPercent;

    public ScholarshipStudent(String id, String name, String email, double cgpa, int maxCredit, double perCreditFee, double discountPercent) {
        super(id, name, email, cgpa, maxCredit);
        this.perCreditFee = perCreditFee;
        this.discountPercent = discountPercent;
    }

    @Override
    public String getCategory() {
        return "ScholarshipStudent";
    }

    @Override
    public double calculateSemesterFee() {
        double total = getCurrentCreditLoad() * perCreditFee;
        double discount = total * (discountPercent / 100.0);
        return total - discount;
    }
}

class InternationalStudent extends Student {
    private double perCreditFee;
    private double internationalFee;

    public InternationalStudent(String id, String name, String email, double cgpa, int maxCredit, double perCreditFee, double internationalFee) {
        super(id, name, email, cgpa, maxCredit);
        this.perCreditFee = perCreditFee;
        this.internationalFee = internationalFee;
    }

    @Override
    public String getCategory() {
        return "InternationalStudent";
    }

    @Override
    public double calculateSemesterFee() {
        return (getCurrentCreditLoad() * perCreditFee) + internationalFee;
    }
}

// ----------------------------------------------------------------------------
// 6. COURSE & COURSE REGISTRATION (ASSOCIATION & COMPOSITION)
// ----------------------------------------------------------------------------

class CourseRegistration {
    private Student student;
    private Course course;
    private String registrationDate;
    private String semester;
    private String grade;

    // Created inside Course when a student registers (Composition)
    public CourseRegistration(Student student, Course course, String registrationDate, String semester) {
        this.student = student;
        this.course = course;
        this.registrationDate = registrationDate;
        this.semester = semester;
        this.grade = "PENDING";
    }

    public Student getStudent() {
        return student;
    }

    public Course getCourse() {
        return course;
    }

    public String getSummary() {
        return "[" + semester + "] " + student.getName() + " registered in "
            + course.getCourseCode() + " (" + course.getCredit() + " Cr) on " + registrationDate;
    }
}

class Course {
    private String courseCode;
    private String title;
    private int credit;
    private Teacher instructor;
    private int maxCapacity;
    private boolean deadlinePassed;
    private List<CourseRegistration> registrations;

    public Course(String courseCode, String title, int credit, Teacher instructor, int maxCapacity) {
        this.courseCode = courseCode;
        this.title = title;
        this.credit = credit;
        this.instructor = instructor;
        this.maxCapacity = maxCapacity;
        this.deadlinePassed = false;
        this.registrations = new ArrayList<>();
    }

    public String getCourseCode() {
        return courseCode;
    }

    public String getTitle() {
        return title;
    }

    public int getCredit() {
        return credit;
    }

    public void setDeadlinePassed(boolean passed) {
        this.deadlinePassed = passed;
    }

    public boolean isStudentRegistered(Student s) {
        for (CourseRegistration reg : registrations) {
            if (reg.getStudent().getStudentId().equals(s.getStudentId())) {
                return true;
            }
        }
        return false;
    }

    // Checks all 4 registration rejection rules before creating CourseRegistration
    public CourseRegistration registerStudent(Student student, String date, String semester)
            throws CreditLimitExceededException, CourseFullException,
                   UnpaidFeeException, RegistrationDeadlinePassedException {

        if (deadlinePassed) {
            throw new RegistrationDeadlinePassedException(
                "Registration rejected for " + student.getName() + ": Registration deadline has passed for " + courseCode
            );
        }

        if (!student.isFeePaid()) {
            throw new UnpaidFeeException(
                "Registration rejected for " + student.getName() + ": Required fee has not been paid"
            );
        }

        if (registrations.size() >= maxCapacity) {
            throw new CourseFullException(
                "Registration rejected for " + student.getName() + ": Course " + courseCode + " is already full"
            );
        }

        if (student.getCurrentCreditLoad() + this.credit > student.getMaxCreditLimit()) {
            throw new CreditLimitExceededException(
                "Registration rejected for " + student.getName() + ": Exceeded maximum credit limit (" + student.getMaxCreditLimit() + ")"
            );
        }

        CourseRegistration reg = new CourseRegistration(student, this, date, semester);
        registrations.add(reg);
        student.addCredits(this.credit);
        student.addRegistration(reg);

        System.out.println("[Registered] " + reg.getSummary());
        return reg;
    }
}

// ----------------------------------------------------------------------------
// 7. EXAMINATION HIERARCHY (MIDTERM, FINAL, ONLINE EXAM)
// ----------------------------------------------------------------------------

abstract class Examination {
    private String examId;
    private Course course;
    private double baseFee;
    private boolean timeExpired;
    private List<String> submittedStudentIds;

    public Examination(String examId, Course course, double baseFee) {
        this.examId = examId;
        this.course = course;
        this.baseFee = baseFee;
        this.timeExpired = false;
        this.submittedStudentIds = new ArrayList<>();
    }

    public String getExamId() {
        return examId;
    }

    public double getBaseFee() {
        return baseFee;
    }

    public void setTimeExpired(boolean expired) {
        this.timeExpired = expired;
    }

    public abstract String getExamType();
    public abstract double calculateExamFee();
    public abstract double calculateMarks(double rawScore);

    // Checks all 3 examination submission rejection rules
    public void submitExamPaper(Student student, double rawScore)
            throws UnregisteredCourseExamException, ExamTimeExpiredException, DuplicateExamSubmissionException {

        if (!course.isStudentRegistered(student)) {
            throw new UnregisteredCourseExamException(
                "Exam rejected for " + student.getName() + ": Student is not registered in " + course.getCourseCode()
            );
        }

        if (timeExpired) {
            throw new ExamTimeExpiredException(
                "Exam rejected for " + student.getName() + ": Examination time has expired for " + examId
            );
        }

        if (submittedStudentIds.contains(student.getStudentId())) {
            throw new DuplicateExamSubmissionException(
                "Exam rejected for " + student.getName() + ": Cannot submit " + examId + " more than once"
            );
        }

        submittedStudentIds.add(student.getStudentId());
        double finalMarks = calculateMarks(rawScore);
        System.out.println("[ExamSubmitted] " + getExamType() + " (" + examId + ") | Student: "
            + student.getName() + " | Marks: " + finalMarks + " | Fee: BDT " + calculateExamFee());
    }
}

class MidtermExam extends Examination {
    public MidtermExam(String examId, Course course, double baseFee) {
        super(examId, course, baseFee);
    }

    @Override
    public String getExamType() {
        return "MidtermExam";
    }

    @Override
    public double calculateExamFee() {
        return getBaseFee();
    }

    @Override
    public double calculateMarks(double rawScore) {
        return rawScore * 0.30;
    }
}

class FinalExam extends Examination {
    private double labExamFee;

    public FinalExam(String examId, Course course, double baseFee, double labExamFee) {
        super(examId, course, baseFee);
        this.labExamFee = labExamFee;
    }

    @Override
    public String getExamType() {
        return "FinalExam";
    }

    @Override
    public double calculateExamFee() {
        return getBaseFee() + labExamFee;
    }

    @Override
    public double calculateMarks(double rawScore) {
        return rawScore * 0.50;
    }
}

class OnlineExam extends Examination {
    private double platformFee;

    public OnlineExam(String examId, Course course, double baseFee, double platformFee) {
        super(examId, course, baseFee);
        this.platformFee = platformFee;
    }

    @Override
    public String getExamType() {
        return "OnlineExam";
    }

    @Override
    public double calculateExamFee() {
        return getBaseFee() + platformFee;
    }

    @Override
    public double calculateMarks(double rawScore) {
        return rawScore * 0.20;
    }
}

// ----------------------------------------------------------------------------
// 8. MAIN CLASS (SYSTEM TEST & DEMONSTRATION)
// ----------------------------------------------------------------------------

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SMART UNIVERSITY EXAMINATION & COURSE MANAGEMENT SYSTEM ===");

        // 1. Department & Teacher Aggregation (Teachers exist independently and can transfer)
        Department cse = new Department("CSE", "Computer Science");
        Department eee = new Department("EEE", "Electrical Engineering");

        Teacher t1 = new Teacher("T-101", "Dr. Rahim", "Professor");
        Teacher t2 = new Teacher("T-102", "Dr. Nadia", "Associate Professor");

        cse.addTeacher(t1);
        cse.addTeacher(t2);
        System.out.println("Before Transfer: " + t2.getInfo());

        cse.transferTeacherTo(t2, eee);
        System.out.println("After Transfer: " + t2.getInfo());

        // 2. Courses
        Course oopCourse = new Course("CSE-201", "Object Oriented Programming", 3, t1, 2);
        Course aiCourse = new Course("CSE-401", "Artificial Intelligence", 4, t1, 3);
        cse.addCourse(oopCourse);
        cse.addCourse(aiCourse);

        // 3. Students (Regular, Scholarship, International)
        Student s1 = new RegularStudent("S-01", "Arafat", "arafat@uni.edu", 3.75, 6, 3000.0, 1500.0);
        Student s2 = new ScholarshipStudent("S-02", "Maliha", "maliha@uni.edu", 3.92, 9, 3000.0, 50.0);
        Student s3 = new InternationalStudent("S-03", "Kenji", "kenji@uni.edu", 3.60, 9, 3000.0, 5000.0);

        // Test CGPA protection (must remain between 0.00 and 4.00)
        s1.setCgpa(4.50);

        // 4. Payment Methods (Cash, Credit Card, Mobile Banking)
        PaymentMethod cash = new CashPayment("RCPT-101");
        PaymentMethod card = new CreditCardPayment("4242-XXXX", "CityBank");
        PaymentMethod bkash = new MobileBankingPayment("bKash", "01700000000");

        // Test Registration Rejection 1: Unpaid Fee
        try {
            oopCourse.registerStudent(s1, "2026-01-10", "Spring-2026");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        // Pay fees
        s1.payFee(cash, 10500.0);
        s2.payFee(card, 9000.0);
        s3.payFee(bkash, 14000.0);

        // Valid Course Registrations
        try {
            oopCourse.registerStudent(s1, "2026-01-12", "Spring-2026");
            oopCourse.registerStudent(s2, "2026-01-12", "Spring-2026");
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        // Test Registration Rejection 2: Course is already full (maxCapacity = 2)
        try {
            oopCourse.registerStudent(s3, "2026-01-13", "Spring-2026");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        // Test Registration Rejection 3: Exceeded maximum credit limit (3 + 4 = 7 > 6)
        try {
            aiCourse.registerStudent(s1, "2026-01-14", "Spring-2026");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        // Test Registration Rejection 4: Registration deadline has passed
        aiCourse.setDeadlinePassed(true);
        try {
            aiCourse.registerStudent(s2, "2026-02-01", "Spring-2026");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        // 5. Calculate Semester Fee Polymorphically
        List<Student> students = new ArrayList<>();
        students.add(s1);
        students.add(s2);
        students.add(s3);
        for (Student st : students) {
            System.out.println("[SemesterFee] " + st.getName() + " (" + st.getCategory()
                + ", Credits: " + st.getCurrentCreditLoad() + ") -> BDT " + st.calculateSemesterFee());
        }

        // 6. Examinations & Online Exam Operations
        Examination midterm = new MidtermExam("MID-201", oopCourse, 500.0);
        Examination finalExam = new FinalExam("FIN-201", oopCourse, 1000.0, 300.0);
        OnlineExam onlineExam = new OnlineExam("ONL-201", oopCourse, 400.0, 150.0);

        s1.login("arafat_01");
        s1.startExam(onlineExam.getExamId());
        s1.submitExam(onlineExam.getExamId());

        try {
            midterm.submitExamPaper(s1, 80.0);
            finalExam.submitExamPaper(s2, 90.0);
            onlineExam.submitExamPaper(s1, 95.0);
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        // Test Exam Rejection 1: Submit more than once
        try {
            onlineExam.submitExamPaper(s1, 100.0);
        } catch (Exception e) {
            System.out.println("[ExamRejected] " + e.getMessage());
        }

        // Test Exam Rejection 2: Student not registered for the course
        try {
            midterm.submitExamPaper(s3, 85.0);
        } catch (Exception e) {
            System.out.println("[ExamRejected] " + e.getMessage());
        }

        // Test Exam Rejection 3: Examination time has expired
        finalExam.setTimeExpired(true);
        try {
            finalExam.submitExamPaper(s1, 88.0);
        } catch (Exception e) {
            System.out.println("[ExamRejected] " + e.getMessage());
        }

        System.out.println("=== UNIVERSITY SYSTEM VERIFICATION COMPLETE ===");
    }
}
`;

export const STAGE_1_EXPECTED_OUTPUT = `=== SMART UNIVERSITY EXAMINATION & COURSE MANAGEMENT SYSTEM ===
Before Transfer: T-102: Dr. Nadia (Associate Professor) - Dept: CSE
[Transfer] Dr. Nadia transferred from CSE to EEE
After Transfer: T-102: Dr. Nadia (Associate Professor) - Dept: EEE
[Validation] Invalid CGPA 4.5 for Arafat. Must be between 0.00 and 4.00.
[Rejected] Registration rejected for Arafat: Required fee has not been paid
[Cash] Arafat paid BDT 10500.0 at Cash Counter (Receipt: RCPT-101)
[CreditCard] Maliha paid BDT 9180.0 (with 2% fee) via CityBank Card 4242-XXXX
[MobileBanking] Kenji paid BDT 13860.0 (after 1% cashback) via bKash 01700000000
[Registered] [Spring-2026] Arafat registered in CSE-201 (3 Cr) on 2026-01-12
[Registered] [Spring-2026] Maliha registered in CSE-201 (3 Cr) on 2026-01-12
[Rejected] Registration rejected for Kenji: Course CSE-201 is already full
[Rejected] Registration rejected for Arafat: Exceeded maximum credit limit (6)
[Rejected] Registration rejected for Maliha: Registration deadline has passed for CSE-401
[SemesterFee] Arafat (RegularStudent, Credits: 3) -> BDT 10500.0
[SemesterFee] Maliha (ScholarshipStudent, Credits: 3) -> BDT 4500.0
[SemesterFee] Kenji (InternationalStudent, Credits: 0) -> BDT 5000.0
[OnlinePortal] Arafat (arafat_01) logged in.
[OnlinePortal] Arafat started online exam: ONL-201
[OnlinePortal] Arafat submitted answers for: ONL-201
[ExamSubmitted] MidtermExam (MID-201) | Student: Arafat | Marks: 24.0 | Fee: BDT 500.0
[ExamSubmitted] FinalExam (FIN-201) | Student: Maliha | Marks: 45.0 | Fee: BDT 1300.0
[ExamSubmitted] OnlineExam (ONL-201) | Student: Arafat | Marks: 19.0 | Fee: BDT 550.0
[ExamRejected] Exam rejected for Arafat: Cannot submit ONL-201 more than once
[ExamRejected] Exam rejected for Kenji: Student is not registered in CSE-201
[ExamRejected] Exam rejected for Arafat: Examination time has expired for FIN-201
=== UNIVERSITY SYSTEM VERIFICATION COMPLETE ===`;

// ============================================================================
// PROJECT 2: SMART HOSPITAL PATIENT & APPOINTMENT MANAGEMENT SYSTEM (~580 LINES)
// ============================================================================
export const STAGE_2_HOSPITAL_CODE = `import java.util.*;

// ============================================================================
// PROJECT 2: SMART HOSPITAL PATIENT & APPOINTMENT MANAGEMENT SYSTEM
// Full Java OOP Project (~580 Lines)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. CUSTOM EXCEPTIONS (BOOKING & TREATMENT REJECTION RULES)
// ----------------------------------------------------------------------------

class StayLimitExceededException extends Exception {
    public StayLimitExceededException(String message) {
        super(message);
    }
}

class WardFullException extends Exception {
    public WardFullException(String message) {
        super(message);
    }
}

class UnpaidDepositException extends Exception {
    public UnpaidDepositException(String message) {
        super(message);
    }
}

class BookingTimePassedException extends Exception {
    public BookingTimePassedException(String message) {
        super(message);
    }
}

class UnbookedPatientException extends Exception {
    public UnbookedPatientException(String message) {
        super(message);
    }
}

class ServiceHoursExpiredException extends Exception {
    public ServiceHoursExpiredException(String message) {
        super(message);
    }
}

class DuplicateServiceException extends Exception {
    public DuplicateServiceException(String message) {
        super(message);
    }
}

// ----------------------------------------------------------------------------
// 2. INTERFACES (ONLINE CHECKUP & PAYMENT METHODS)
// ----------------------------------------------------------------------------

interface OnlineCheckupCapable {
    void login(String userId);
    void startConsultation(String serviceId);
    void downloadPrescription(String serviceId);
}

interface PaymentMethod {
    String getMethodName();
    String processPayment(String patientName, double amount);
}

// ----------------------------------------------------------------------------
// 3. PAYMENT METHOD CLASSES (CASH, CREDIT CARD, MOBILE BANKING)
// ----------------------------------------------------------------------------

class CashPayment implements PaymentMethod {
    private String slipNo;

    public CashPayment(String slipNo) {
        this.slipNo = slipNo;
    }

    @Override
    public String getMethodName() {
        return "Cash";
    }

    @Override
    public String processPayment(String patientName, double amount) {
        return "[Cash] " + patientName + " paid BDT " + amount
            + " at Hospital Counter (Slip: " + slipNo + ")";
    }
}

class CreditCardPayment implements PaymentMethod {
    private String cardNo;
    private String bankName;

    public CreditCardPayment(String cardNo, String bankName) {
        this.cardNo = cardNo;
        this.bankName = bankName;
    }

    @Override
    public String getMethodName() {
        return "Credit Card";
    }

    @Override
    public String processPayment(String patientName, double amount) {
        double serviceCharge = amount * 0.02;
        double total = amount + serviceCharge;
        return "[CreditCard] " + patientName + " paid BDT " + total
            + " (with 2% fee) via " + bankName + " Card " + cardNo;
    }
}

class MobileBankingPayment implements PaymentMethod {
    private String walletName;
    private String phoneNo;

    public MobileBankingPayment(String walletName, String phoneNo) {
        this.walletName = walletName;
        this.phoneNo = phoneNo;
    }

    @Override
    public String getMethodName() {
        return "Mobile Banking";
    }

    @Override
    public String processPayment(String patientName, double amount) {
        double cashback = amount * 0.01;
        double net = amount - cashback;
        return "[MobileBanking] " + patientName + " paid BDT " + net
            + " (after 1% cashback) via " + walletName + " " + phoneNo;
    }
}

// ----------------------------------------------------------------------------
// 4. DOCTOR & DEPARTMENT (AGGREGATION — INDEPENDENT LIFECYCLE)
// ----------------------------------------------------------------------------

class Doctor {
    private String doctorId;
    private String name;
    private String specialization;
    private String currentDept;

    public Doctor(String doctorId, String name, String specialization) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialization = specialization;
        this.currentDept = "NONE";
    }

    public String getDoctorId() {
        return doctorId;
    }

    public String getName() {
        return name;
    }

    public void setCurrentDept(String dept) {
        this.currentDept = dept;
    }

    public String getInfo() {
        return doctorId + ": " + name + " (" + specialization + ") - Dept: " + currentDept;
    }
}

class HospitalDepartment {
    private String deptCode;
    private String deptName;
    private List<Doctor> doctors;
    private List<Ward> wards;

    public HospitalDepartment(String deptCode, String deptName) {
        this.deptCode = deptCode;
        this.deptName = deptName;
        this.doctors = new ArrayList<>();
        this.wards = new ArrayList<>();
    }

    public String getDeptCode() {
        return deptCode;
    }

    public void addDoctor(Doctor doc) {
        if (!doctors.contains(doc)) {
            doctors.add(doc);
            doc.setCurrentDept(this.deptCode);
        }
    }

    public void removeDoctor(Doctor doc) {
        if (doctors.remove(doc)) {
            doc.setCurrentDept("NONE");
        }
    }

    public void transferDoctorTo(Doctor doc, HospitalDepartment newDept) {
        this.removeDoctor(doc);
        newDept.addDoctor(doc);
        System.out.println("[Transfer] " + doc.getName() + " transferred from "
            + this.deptCode + " to " + newDept.getDeptCode());
    }

    public void addWard(Ward ward) {
        if (!wards.contains(ward)) {
            wards.add(ward);
        }
    }
}

// ----------------------------------------------------------------------------
// 5. PATIENT HIERARCHY (ENCAPSULATION, INHERITANCE & POLYMORPHISM)
// ----------------------------------------------------------------------------

abstract class Patient implements OnlineCheckupCapable {
    private String patientId;
    private String name;
    private int age;
    private int currentBookedDays;
    private int maxStayLimit;
    private boolean depositPaid;
    private boolean loggedIn;
    private List<RoomBooking> bookings;

    public Patient(String patientId, String name, int age, int maxStayLimit) {
        this.patientId = patientId;
        this.name = name;
        this.currentBookedDays = 0;
        this.maxStayLimit = maxStayLimit;
        this.depositPaid = false;
        this.loggedIn = false;
        this.bookings = new ArrayList<>();
        setAge(age);
    }

    // Age must remain between 0 and 120
    public void setAge(int newAge) {
        if (newAge < 0 || newAge > 120) {
            System.out.println("[Validation] Invalid age " + newAge + " for " + name + ". Must be between 0 and 120.");
            return;
        }
        this.age = newAge;
    }

    public String getPatientId() {
        return patientId;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public int getCurrentBookedDays() {
        return currentBookedDays;
    }

    public int getMaxStayLimit() {
        return maxStayLimit;
    }

    public boolean isDepositPaid() {
        return depositPaid;
    }

    public void addBookedDays(int days) {
        this.currentBookedDays += days;
    }

    public void addBooking(RoomBooking booking) {
        this.bookings.add(booking);
    }

    public void payDeposit(PaymentMethod method, double amount) {
        String receipt = method.processPayment(this.name, amount);
        this.depositPaid = true;
        System.out.println(receipt);
    }

    @Override
    public void login(String userId) {
        this.loggedIn = true;
        System.out.println("[OnlineCheckup] " + name + " (" + userId + ") logged in.");
    }

    @Override
    public void startConsultation(String serviceId) {
        if (!loggedIn) {
            System.out.println("[OnlineCheckup] Please log in first!");
            return;
        }
        System.out.println("[OnlineCheckup] " + name + " started video consultation: " + serviceId);
    }

    @Override
    public void downloadPrescription(String serviceId) {
        System.out.println("[OnlineCheckup] " + name + " downloaded prescription for: " + serviceId);
    }

    public abstract String getCategory();
    public abstract double calculateHospitalBill();
}

class GeneralPatient extends Patient {
    private double dailyBedCharge;
    private double medicineCharge;

    public GeneralPatient(String id, String name, int age, int maxDays, double dailyBedCharge, double medicineCharge) {
        super(id, name, age, maxDays);
        this.dailyBedCharge = dailyBedCharge;
        this.medicineCharge = medicineCharge;
    }

    @Override
    public String getCategory() {
        return "GeneralPatient";
    }

    @Override
    public double calculateHospitalBill() {
        return (getCurrentBookedDays() * dailyBedCharge) + medicineCharge;
    }
}

class InsuredPatient extends Patient {
    private double dailyBedCharge;
    private double discountPercent;

    public InsuredPatient(String id, String name, int age, int maxDays, double dailyBedCharge, double discountPercent) {
        super(id, name, age, maxDays);
        this.dailyBedCharge = dailyBedCharge;
        this.discountPercent = discountPercent;
    }

    @Override
    public String getCategory() {
        return "InsuredPatient";
    }

    @Override
    public double calculateHospitalBill() {
        double total = getCurrentBookedDays() * dailyBedCharge;
        return total - (total * (discountPercent / 100.0));
    }
}

class EmergencyPatient extends Patient {
    private double dailyBedCharge;
    private double icuCharge;

    public EmergencyPatient(String id, String name, int age, int maxDays, double dailyBedCharge, double icuCharge) {
        super(id, name, age, maxDays);
        this.dailyBedCharge = dailyBedCharge;
        this.icuCharge = icuCharge;
    }

    @Override
    public String getCategory() {
        return "EmergencyPatient";
    }

    @Override
    public double calculateHospitalBill() {
        return (getCurrentBookedDays() * dailyBedCharge) + icuCharge;
    }
}

// ----------------------------------------------------------------------------
// 6. WARD & ROOM BOOKING (ASSOCIATION & COMPOSITION)
// ----------------------------------------------------------------------------

class RoomBooking {
    private Patient patient;
    private Ward ward;
    private String bookingDate;
    private String shift;

    public RoomBooking(Patient patient, Ward ward, String bookingDate, String shift) {
        this.patient = patient;
        this.ward = ward;
        this.bookingDate = bookingDate;
        this.shift = shift;
    }

    public Patient getPatient() {
        return patient;
    }

    public String getSummary() {
        return "[" + shift + "] " + patient.getName() + " booked in "
            + ward.getWardCode() + " (" + ward.getStayDays() + " Days) on " + bookingDate;
    }
}

class Ward {
    private String wardCode;
    private String wardName;
    private int stayDays;
    private Doctor dutyDoctor;
    private int maxBeds;
    private boolean bookingClosed;
    private List<RoomBooking> bookings;

    public Ward(String wardCode, String wardName, int stayDays, Doctor dutyDoctor, int maxBeds) {
        this.wardCode = wardCode;
        this.wardName = wardName;
        this.stayDays = stayDays;
        this.dutyDoctor = dutyDoctor;
        this.maxBeds = maxBeds;
        this.bookingClosed = false;
        this.bookings = new ArrayList<>();
    }

    public String getWardCode() {
        return wardCode;
    }

    public int getStayDays() {
        return stayDays;
    }

    public void setBookingClosed(boolean closed) {
        this.bookingClosed = closed;
    }

    public boolean isPatientBooked(Patient p) {
        for (RoomBooking b : bookings) {
            if (b.getPatient().getPatientId().equals(p.getPatientId())) {
                return true;
            }
        }
        return false;
    }

    public RoomBooking bookPatient(Patient patient, String date, String shift)
            throws StayLimitExceededException, WardFullException,
                   UnpaidDepositException, BookingTimePassedException {

        if (bookingClosed) {
            throw new BookingTimePassedException(
                "Booking rejected for " + patient.getName() + ": Booking time has passed for " + wardCode
            );
        }

        if (!patient.isDepositPaid()) {
            throw new UnpaidDepositException(
                "Booking rejected for " + patient.getName() + ": Advance deposit has not been paid"
            );
        }

        if (bookings.size() >= maxBeds) {
            throw new WardFullException(
                "Booking rejected for " + patient.getName() + ": Ward " + wardCode + " is already full"
            );
        }

        if (patient.getCurrentBookedDays() + this.stayDays > patient.getMaxStayLimit()) {
            throw new StayLimitExceededException(
                "Booking rejected for " + patient.getName() + ": Exceeded maximum stay limit (" + patient.getMaxStayLimit() + ")"
            );
        }

        RoomBooking booking = new RoomBooking(patient, this, date, shift);
        bookings.add(booking);
        patient.addBookedDays(this.stayDays);
        patient.addBooking(booking);

        System.out.println("[Booked] " + booking.getSummary());
        return booking;
    }
}

// ----------------------------------------------------------------------------
// 7. MEDICAL SERVICE HIERARCHY (LAB TEST, SURGERY, ONLINE CHECKUP)
// ----------------------------------------------------------------------------

abstract class MedicalService {
    private String serviceId;
    private Ward ward;
    private double baseFee;
    private boolean serviceHoursExpired;
    private List<String> completedPatientIds;

    public MedicalService(String serviceId, Ward ward, double baseFee) {
        this.serviceId = serviceId;
        this.ward = ward;
        this.baseFee = baseFee;
        this.serviceHoursExpired = false;
        this.completedPatientIds = new ArrayList<>();
    }

    public String getServiceId() {
        return serviceId;
    }

    public double getBaseFee() {
        return baseFee;
    }

    public void setServiceHoursExpired(boolean expired) {
        this.serviceHoursExpired = expired;
    }

    public abstract String getServiceType();
    public abstract double calculateServiceFee();
    public abstract double calculateHealthScore(double rawPoints);

    public void completeService(Patient patient, double rawPoints)
            throws UnbookedPatientException, ServiceHoursExpiredException, DuplicateServiceException {

        if (!ward.isPatientBooked(patient)) {
            throw new UnbookedPatientException(
                "Service rejected for " + patient.getName() + ": Patient is not booked in " + ward.getWardCode()
            );
        }

        if (serviceHoursExpired) {
            throw new ServiceHoursExpiredException(
                "Service rejected for " + patient.getName() + ": Service hours have expired for " + serviceId
            );
        }

        if (completedPatientIds.contains(patient.getPatientId())) {
            throw new DuplicateServiceException(
                "Service rejected for " + patient.getName() + ": Cannot request " + serviceId + " more than once"
            );
        }

        completedPatientIds.add(patient.getPatientId());
        double score = calculateHealthScore(rawPoints);
        System.out.println("[ServiceCompleted] " + getServiceType() + " (" + serviceId + ") | Patient: "
            + patient.getName() + " | Score: " + score + " | Fee: BDT " + calculateServiceFee());
    }
}

class LabTestService extends MedicalService {
    public LabTestService(String id, Ward ward, double baseFee) {
        super(id, ward, baseFee);
    }

    @Override
    public String getServiceType() {
        return "LabTest";
    }

    @Override
    public double calculateServiceFee() {
        return getBaseFee();
    }

    @Override
    public double calculateHealthScore(double rawPoints) {
        return rawPoints * 0.50;
    }
}

class SurgeryService extends MedicalService {
    private double otRoomCharge;

    public SurgeryService(String id, Ward ward, double baseFee, double otRoomCharge) {
        super(id, ward, baseFee);
        this.otRoomCharge = otRoomCharge;
    }

    @Override
    public String getServiceType() {
        return "Surgery";
    }

    @Override
    public double calculateServiceFee() {
        return getBaseFee() + otRoomCharge;
    }

    @Override
    public double calculateHealthScore(double rawPoints) {
        return rawPoints * 0.80;
    }
}

class OnlineCheckupService extends MedicalService {
    private double appFee;

    public OnlineCheckupService(String id, Ward ward, double baseFee, double appFee) {
        super(id, ward, baseFee);
        this.appFee = appFee;
    }

    @Override
    public String getServiceType() {
        return "OnlineCheckup";
    }

    @Override
    public double calculateServiceFee() {
        return getBaseFee() + appFee;
    }

    @Override
    public double calculateHealthScore(double rawPoints) {
        return rawPoints * 0.40;
    }
}

// ----------------------------------------------------------------------------
// 8. MAIN CLASS (SYSTEM TEST & DEMONSTRATION)
// ----------------------------------------------------------------------------

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SMART HOSPITAL PATIENT & APPOINTMENT MANAGEMENT SYSTEM ===");

        HospitalDepartment cardiology = new HospitalDepartment("CARD", "Cardiology");
        HospitalDepartment neurology = new HospitalDepartment("NEUR", "Neurology");

        Doctor d1 = new Doctor("D-101", "Dr. Kamal", "Heart Specialist");
        Doctor d2 = new Doctor("D-102", "Dr. Samia", "Surgeon");

        cardiology.addDoctor(d1);
        cardiology.addDoctor(d2);
        System.out.println("Before Transfer: " + d2.getInfo());

        cardiology.transferDoctorTo(d2, neurology);
        System.out.println("After Transfer: " + d2.getInfo());

        Ward wardA = new Ward("WARD-101", "Heart Care Ward", 3, d1, 2);
        Ward wardB = new Ward("WARD-202", "Special Recovery Ward", 4, d1, 3);
        cardiology.addWard(wardA);
        cardiology.addWard(wardB);

        Patient p1 = new GeneralPatient("P-01", "Tariq", 35, 6, 2000.0, 1000.0);
        Patient p2 = new InsuredPatient("P-02", "Nusrat", 29, 9, 2000.0, 50.0);
        Patient p3 = new EmergencyPatient("P-03", "Rafiq", 50, 9, 2000.0, 4000.0);

        p1.setAge(150);

        PaymentMethod cash = new CashPayment("SLIP-101");
        PaymentMethod card = new CreditCardPayment("5500-XXXX", "BRACBank");
        PaymentMethod nagad = new MobileBankingPayment("Nagad", "01800000000");

        try {
            wardA.bookPatient(p1, "2026-03-01", "Morning");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        p1.payDeposit(cash, 7000.0);
        p2.payDeposit(card, 6000.0);
        p3.payDeposit(nagad, 10000.0);

        try {
            wardA.bookPatient(p1, "2026-03-02", "Morning");
            wardA.bookPatient(p2, "2026-03-02", "Morning");
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            wardA.bookPatient(p3, "2026-03-03", "Evening");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        try {
            wardB.bookPatient(p1, "2026-03-04", "Evening");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        wardB.setBookingClosed(true);
        try {
            wardB.bookPatient(p2, "2026-03-05", "Morning");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        List<Patient> patients = new ArrayList<>();
        patients.add(p1);
        patients.add(p2);
        patients.add(p3);
        for (Patient pt : patients) {
            System.out.println("[HospitalBill] " + pt.getName() + " (" + pt.getCategory()
                + ", Days: " + pt.getCurrentBookedDays() + ") -> BDT " + pt.calculateHospitalBill());
        }

        MedicalService lab = new LabTestService("SRV-LAB", wardA, 1000.0);
        MedicalService surgery = new SurgeryService("SRV-SURG", wardA, 5000.0, 2000.0);
        OnlineCheckupService online = new OnlineCheckupService("SRV-ONL", wardA, 800.0, 200.0);

        p1.login("tariq_01");
        p1.startConsultation(online.getServiceId());
        p1.downloadPrescription(online.getServiceId());

        try {
            lab.completeService(p1, 80.0);
            surgery.completeService(p2, 90.0);
            online.completeService(p1, 95.0);
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            online.completeService(p1, 95.0);
        } catch (Exception e) {
            System.out.println("[ServiceRejected] " + e.getMessage());
        }

        try {
            lab.completeService(p3, 85.0);
        } catch (Exception e) {
            System.out.println("[ServiceRejected] " + e.getMessage());
        }

        surgery.setServiceHoursExpired(true);
        try {
            surgery.completeService(p1, 88.0);
        } catch (Exception e) {
            System.out.println("[ServiceRejected] " + e.getMessage());
        }

        System.out.println("=== HOSPITAL SYSTEM VERIFICATION COMPLETE ===");
    }
}
`;

export const STAGE_2_EXPECTED_OUTPUT = `=== SMART HOSPITAL PATIENT & APPOINTMENT MANAGEMENT SYSTEM ===
Before Transfer: D-102: Dr. Samia (Surgeon) - Dept: CARD
[Transfer] Dr. Samia transferred from CARD to NEUR
After Transfer: D-102: Dr. Samia (Surgeon) - Dept: NEUR
[Validation] Invalid age 150 for Tariq. Must be between 0 and 120.
[Rejected] Booking rejected for Tariq: Advance deposit has not been paid
[Cash] Tariq paid BDT 7000.0 at Hospital Counter (Slip: SLIP-101)
[CreditCard] Nusrat paid BDT 6120.0 (with 2% fee) via BRACBank Card 5500-XXXX
[MobileBanking] Rafiq paid BDT 9900.0 (after 1% cashback) via Nagad 01800000000
[Booked] [Morning] Tariq booked in WARD-101 (3 Days) on 2026-03-02
[Booked] [Morning] Nusrat booked in WARD-101 (3 Days) on 2026-03-02
[Rejected] Booking rejected for Rafiq: Ward WARD-101 is already full
[Rejected] Booking rejected for Tariq: Exceeded maximum stay limit (6)
[Rejected] Booking rejected for Nusrat: Booking time has passed for WARD-202
[HospitalBill] Tariq (GeneralPatient, Days: 3) -> BDT 7000.0
[HospitalBill] Nusrat (InsuredPatient, Days: 3) -> BDT 3000.0
[HospitalBill] Rafiq (EmergencyPatient, Days: 0) -> BDT 4000.0
[OnlineCheckup] Tariq (tariq_01) logged in.
[OnlineCheckup] Tariq started video consultation: SRV-ONL
[OnlineCheckup] Tariq downloaded prescription for: SRV-ONL
[ServiceCompleted] LabTest (SRV-LAB) | Patient: Tariq | Score: 40.0 | Fee: BDT 1000.0
[ServiceCompleted] Surgery (SRV-SURG) | Patient: Nusrat | Score: 72.0 | Fee: BDT 7000.0
[ServiceCompleted] OnlineCheckup (SRV-ONL) | Patient: Tariq | Score: 38.0 | Fee: BDT 1000.0
[ServiceRejected] Service rejected for Tariq: Cannot request SRV-ONL more than once
[ServiceRejected] Service rejected for Rafiq: Patient is not booked in WARD-101
[ServiceRejected] Service rejected for Tariq: Service hours have expired for SRV-SURG
=== HOSPITAL SYSTEM VERIFICATION COMPLETE ===`;

// ============================================================================
// PROJECT 3: SMART LIBRARY BOOK & MEMBERSHIP MANAGEMENT SYSTEM (~580 LINES)
// ============================================================================
export const STAGE_3_LIBRARY_CODE = `import java.util.*;

// ============================================================================
// PROJECT 3: SMART LIBRARY BOOK & MEMBERSHIP MANAGEMENT SYSTEM
// Full Java OOP Project (~580 Lines)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. CUSTOM EXCEPTIONS (BORROWING & REVIEW REJECTION RULES)
// ----------------------------------------------------------------------------

class BookLimitExceededException extends Exception {
    public BookLimitExceededException(String message) {
        super(message);
    }
}

class BookCopiesUnavailableException extends Exception {
    public BookCopiesUnavailableException(String message) {
        super(message);
    }
}

class UnpaidMembershipException extends Exception {
    public UnpaidMembershipException(String message) {
        super(message);
    }
}

class LibraryClosedException extends Exception {
    public LibraryClosedException(String message) {
        super(message);
    }
}

class UnborrowedBookException extends Exception {
    public UnborrowedBookException(String message) {
        super(message);
    }
}

class ReturnTimeExpiredException extends Exception {
    public ReturnTimeExpiredException(String message) {
        super(message);
    }
}

class DuplicateReturnException extends Exception {
    public DuplicateReturnException(String message) {
        super(message);
    }
}

// ----------------------------------------------------------------------------
// 2. INTERFACES (ONLINE E-BOOK READER & PAYMENT METHODS)
// ----------------------------------------------------------------------------

interface OnlineReaderCapable {
    void login(String readerId);
    void openEBook(String quizId);
    void submitReview(String quizId);
}

interface PaymentMethod {
    String getMethodName();
    String processPayment(String memberName, double amount);
}

// ----------------------------------------------------------------------------
// 3. PAYMENT METHOD CLASSES (CASH, CREDIT CARD, MOBILE BANKING)
// ----------------------------------------------------------------------------

class CashPayment implements PaymentMethod {
    private String receiptNo;

    public CashPayment(String receiptNo) {
        this.receiptNo = receiptNo;
    }

    @Override
    public String getMethodName() {
        return "Cash";
    }

    @Override
    public String processPayment(String memberName, double amount) {
        return "[Cash] " + memberName + " paid BDT " + amount
            + " at Library Desk (Receipt: " + receiptNo + ")";
    }
}

class CreditCardPayment implements PaymentMethod {
    private String cardNo;
    private String bankName;

    public CreditCardPayment(String cardNo, String bankName) {
        this.cardNo = cardNo;
        this.bankName = bankName;
    }

    @Override
    public String getMethodName() {
        return "Credit Card";
    }

    @Override
    public String processPayment(String memberName, double amount) {
        double fee = amount * 0.02;
        double total = amount + fee;
        return "[CreditCard] " + memberName + " paid BDT " + total
            + " (with 2% fee) via " + bankName + " Card " + cardNo;
    }
}

class MobileBankingPayment implements PaymentMethod {
    private String appName;
    private String phoneNo;

    public MobileBankingPayment(String appName, String phoneNo) {
        this.appName = appName;
        this.phoneNo = phoneNo;
    }

    @Override
    public String getMethodName() {
        return "Mobile Banking";
    }

    @Override
    public String processPayment(String memberName, double amount) {
        double cashback = amount * 0.01;
        double net = amount - cashback;
        return "[MobileBanking] " + memberName + " paid BDT " + net
            + " (after 1% cashback) via " + appName + " " + phoneNo;
    }
}

// ----------------------------------------------------------------------------
// 4. LIBRARIAN & LIBRARY BRANCH (AGGREGATION — INDEPENDENT LIFECYCLE)
// ----------------------------------------------------------------------------

class Librarian {
    private String staffId;
    private String name;
    private String role;
    private String currentBranch;

    public Librarian(String staffId, String name, String role) {
        this.staffId = staffId;
        this.name = name;
        this.role = role;
        this.currentBranch = "NONE";
    }

    public String getStaffId() {
        return staffId;
    }

    public String getName() {
        return name;
    }

    public void setCurrentBranch(String branch) {
        this.currentBranch = branch;
    }

    public String getInfo() {
        return staffId + ": " + name + " (" + role + ") - Branch: " + currentBranch;
    }
}

class LibraryBranch {
    private String branchCode;
    private String branchName;
    private List<Librarian> librarians;
    private List<BookSection> sections;

    public LibraryBranch(String branchCode, String branchName) {
        this.branchCode = branchCode;
        this.branchName = branchName;
        this.librarians = new ArrayList<>();
        this.sections = new ArrayList<>();
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void addLibrarian(Librarian lib) {
        if (!librarians.contains(lib)) {
            librarians.add(lib);
            lib.setCurrentBranch(this.branchCode);
        }
    }

    public void removeLibrarian(Librarian lib) {
        if (librarians.remove(lib)) {
            lib.setCurrentBranch("NONE");
        }
    }

    public void transferLibrarianTo(Librarian lib, LibraryBranch newBranch) {
        this.removeLibrarian(lib);
        newBranch.addLibrarian(lib);
        System.out.println("[Transfer] " + lib.getName() + " transferred from "
            + this.branchCode + " to " + newBranch.getBranchCode());
    }

    public void addSection(BookSection sec) {
        if (!sections.contains(sec)) {
            sections.add(sec);
        }
    }
}

// ----------------------------------------------------------------------------
// 5. MEMBER HIERARCHY (ENCAPSULATION, INHERITANCE & POLYMORPHISM)
// ----------------------------------------------------------------------------

abstract class Member implements OnlineReaderCapable {
    private String memberId;
    private String name;
    private double rating;
    private int currentBorrowedCount;
    private int maxBookLimit;
    private boolean feePaid;
    private boolean loggedIn;
    private List<BorrowRecord> borrowRecords;

    public Member(String memberId, String name, double rating, int maxBookLimit) {
        this.memberId = memberId;
        this.name = name;
        this.currentBorrowedCount = 0;
        this.maxBookLimit = maxBookLimit;
        this.feePaid = false;
        this.loggedIn = false;
        this.borrowRecords = new ArrayList<>();
        setRating(rating);
    }

    // Rating must remain between 1.0 and 5.0
    public void setRating(double newRating) {
        if (newRating < 1.0 || newRating > 5.0) {
            System.out.println("[Validation] Invalid rating " + newRating + " for " + name + ". Must be between 1.0 and 5.0.");
            return;
        }
        this.rating = newRating;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getName() {
        return name;
    }

    public int getCurrentBorrowedCount() {
        return currentBorrowedCount;
    }

    public int getMaxBookLimit() {
        return maxBookLimit;
    }

    public boolean isFeePaid() {
        return feePaid;
    }

    public void addBooks(int count) {
        this.currentBorrowedCount += count;
    }

    public void addBorrowRecord(BorrowRecord rec) {
        this.borrowRecords.add(rec);
    }

    public void payMembershipFee(PaymentMethod method, double amount) {
        String receipt = method.processPayment(this.name, amount);
        this.feePaid = true;
        System.out.println(receipt);
    }

    @Override
    public void login(String readerId) {
        this.loggedIn = true;
        System.out.println("[OnlineReader] " + name + " (" + readerId + ") logged in.");
    }

    @Override
    public void openEBook(String activityId) {
        if (!loggedIn) {
            System.out.println("[OnlineReader] Please log in first!");
            return;
        }
        System.out.println("[OnlineReader] " + name + " opened digital material: " + activityId);
    }

    @Override
    public void submitReview(String activityId) {
        System.out.println("[OnlineReader] " + name + " submitted reading log for: " + activityId);
    }

    public abstract String getCategory();
    public abstract double calculateMembershipBill();
}

class RegularMember extends Member {
    private double perBookFee;
    private double cardFee;

    public RegularMember(String id, String name, double rating, int maxBooks, double perBookFee, double cardFee) {
        super(id, name, rating, maxBooks);
        this.perBookFee = perBookFee;
        this.cardFee = cardFee;
    }

    @Override
    public String getCategory() {
        return "RegularMember";
    }

    @Override
    public double calculateMembershipBill() {
        return (getCurrentBorrowedCount() * perBookFee) + cardFee;
    }
}

class StudentMember extends Member {
    private double perBookFee;
    private double discountPercent;

    public StudentMember(String id, String name, double rating, int maxBooks, double perBookFee, double discountPercent) {
        super(id, name, rating, maxBooks);
        this.perBookFee = perBookFee;
        this.discountPercent = discountPercent;
    }

    @Override
    public String getCategory() {
        return "StudentMember";
    }

    @Override
    public double calculateMembershipBill() {
        double total = getCurrentBorrowedCount() * perBookFee;
        return total - (total * (discountPercent / 100.0));
    }
}

class ResearcherMember extends Member {
    private double perBookFee;
    private double archiveAccessFee;

    public ResearcherMember(String id, String name, double rating, int maxBooks, double perBookFee, double archiveAccessFee) {
        super(id, name, rating, maxBooks);
        this.perBookFee = perBookFee;
        this.archiveAccessFee = archiveAccessFee;
    }

    @Override
    public String getCategory() {
        return "ResearcherMember";
    }

    @Override
    public double calculateMembershipBill() {
        return (getCurrentBorrowedCount() * perBookFee) + archiveAccessFee;
    }
}

// ----------------------------------------------------------------------------
// 6. BOOK SECTION & BORROW RECORD (ASSOCIATION & COMPOSITION)
// ----------------------------------------------------------------------------

class BorrowRecord {
    private Member member;
    private BookSection section;
    private String borrowDate;
    private String month;

    public BorrowRecord(Member member, BookSection section, String borrowDate, String month) {
        this.member = member;
        this.section = section;
        this.borrowDate = borrowDate;
        this.month = month;
    }

    public Member getMember() {
        return member;
    }

    public String getSummary() {
        return "[" + month + "] " + member.getName() + " borrowed from "
            + section.getSectionCode() + " (" + section.getPackBooksCount() + " Books) on " + borrowDate;
    }
}

class BookSection {
    private String sectionCode;
    private String title;
    private int packBooksCount;
    private Librarian manager;
    private int maxBorrowers;
    private boolean libraryClosed;
    private List<BorrowRecord> records;

    public BookSection(String sectionCode, String title, int packBooksCount, Librarian manager, int maxBorrowers) {
        this.sectionCode = sectionCode;
        this.title = title;
        this.packBooksCount = packBooksCount;
        this.manager = manager;
        this.maxBorrowers = maxBorrowers;
        this.libraryClosed = false;
        this.records = new ArrayList<>();
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public int getPackBooksCount() {
        return packBooksCount;
    }

    public void setLibraryClosed(boolean closed) {
        this.libraryClosed = closed;
    }

    public boolean hasMemberBorrowed(Member m) {
        for (BorrowRecord rec : records) {
            if (rec.getMember().getMemberId().equals(m.getMemberId())) {
                return true;
            }
        }
        return false;
    }

    public BorrowRecord borrowBooks(Member member, String date, String month)
            throws BookLimitExceededException, BookCopiesUnavailableException,
                   UnpaidMembershipException, LibraryClosedException {

        if (libraryClosed) {
            throw new LibraryClosedException(
                "Borrow rejected for " + member.getName() + ": Library borrowing hours have closed for " + sectionCode
            );
        }

        if (!member.isFeePaid()) {
            throw new UnpaidMembershipException(
                "Borrow rejected for " + member.getName() + ": Membership fee has not been paid"
            );
        }

        if (records.size() >= maxBorrowers) {
            throw new BookCopiesUnavailableException(
                "Borrow rejected for " + member.getName() + ": Section " + sectionCode + " copies are all taken"
            );
        }

        if (member.getCurrentBorrowedCount() + this.packBooksCount > member.getMaxBookLimit()) {
            throw new BookLimitExceededException(
                "Borrow rejected for " + member.getName() + ": Exceeded maximum book limit (" + member.getMaxBookLimit() + ")"
            );
        }

        BorrowRecord rec = new BorrowRecord(member, this, date, month);
        records.add(rec);
        member.addBooks(this.packBooksCount);
        member.addBorrowRecord(rec);

        System.out.println("[Borrowed] " + rec.getSummary());
        return rec;
    }
}

// ----------------------------------------------------------------------------
// 7. READING ACTIVITY HIERARCHY (PRINTED BOOK, JOURNAL, E-BOOK)
// ----------------------------------------------------------------------------

abstract class ReadingActivity {
    private String activityId;
    private BookSection section;
    private double baseFine;
    private boolean returnTimeExpired;
    private List<String> returnedMemberIds;

    public ReadingActivity(String activityId, BookSection section, double baseFine) {
        this.activityId = activityId;
        this.section = section;
        this.baseFine = baseFine;
        this.returnTimeExpired = false;
        this.returnedMemberIds = new ArrayList<>();
    }

    public String getActivityId() {
        return activityId;
    }

    public double getBaseFine() {
        return baseFine;
    }

    public void setReturnTimeExpired(boolean expired) {
        this.returnTimeExpired = expired;
    }

    public abstract String getMaterialType();
    public abstract double calculateActivityFee();
    public abstract double calculateReadingPoints(double pagesRead);

    public void submitBookReturn(Member member, double pagesRead)
            throws UnborrowedBookException, ReturnTimeExpiredException, DuplicateReturnException {

        if (!section.hasMemberBorrowed(member)) {
            throw new UnborrowedBookException(
                "Return rejected for " + member.getName() + ": Member did not borrow from " + section.getSectionCode()
            );
        }

        if (returnTimeExpired) {
            throw new ReturnTimeExpiredException(
                "Return rejected for " + member.getName() + ": Return time has expired for " + activityId
            );
        }

        if (returnedMemberIds.contains(member.getMemberId())) {
            throw new DuplicateReturnException(
                "Return rejected for " + member.getName() + ": Cannot return " + activityId + " more than once"
            );
        }

        returnedMemberIds.add(member.getMemberId());
        double points = calculateReadingPoints(pagesRead);
        System.out.println("[BookReturned] " + getMaterialType() + " (" + activityId + ") | Member: "
            + member.getName() + " | Points: " + points + " | Fee: BDT " + calculateActivityFee());
    }
}

class PrintedBookActivity extends ReadingActivity {
    public PrintedBookActivity(String id, BookSection section, double baseFine) {
        super(id, section, baseFine);
    }

    @Override
    public String getMaterialType() {
        return "PrintedBook";
    }

    @Override
    public double calculateActivityFee() {
        return getBaseFine();
    }

    @Override
    public double calculateReadingPoints(double pagesRead) {
        return pagesRead * 0.50;
    }
}

class JournalActivity extends ReadingActivity {
    private double printingCharge;

    public JournalActivity(String id, BookSection section, double baseFine, double printingCharge) {
        super(id, section, baseFine);
        this.printingCharge = printingCharge;
    }

    @Override
    public String getMaterialType() {
        return "ResearchJournal";
    }

    @Override
    public double calculateActivityFee() {
        return getBaseFine() + printingCharge;
    }

    @Override
    public double calculateReadingPoints(double pagesRead) {
        return pagesRead * 0.80;
    }
}

class EBookActivity extends ReadingActivity {
    private double digitalLicenseFee;

    public EBookActivity(String id, BookSection section, double baseFine, double digitalLicenseFee) {
        super(id, section, baseFine);
        this.digitalLicenseFee = digitalLicenseFee;
    }

    @Override
    public String getMaterialType() {
        return "EBook";
    }

    @Override
    public double calculateActivityFee() {
        return getBaseFine() + digitalLicenseFee;
    }

    @Override
    public double calculateReadingPoints(double pagesRead) {
        return pagesRead * 0.40;
    }
}

// ----------------------------------------------------------------------------
// 8. MAIN CLASS (SYSTEM TEST & DEMONSTRATION)
// ----------------------------------------------------------------------------

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SMART LIBRARY BOOK & MEMBERSHIP MANAGEMENT SYSTEM ===");

        LibraryBranch centralBranch = new LibraryBranch("CENTRAL", "Central City Library");
        LibraryBranch northBranch = new LibraryBranch("NORTH", "North Town Library");

        Librarian lib1 = new Librarian("L-101", "Farhan", "Head Librarian");
        Librarian lib2 = new Librarian("L-102", "Tania", "Archive Officer");

        centralBranch.addLibrarian(lib1);
        centralBranch.addLibrarian(lib2);
        System.out.println("Before Transfer: " + lib2.getInfo());

        centralBranch.transferLibrarianTo(lib2, northBranch);
        System.out.println("After Transfer: " + lib2.getInfo());

        BookSection javaSection = new BookSection("SEC-JAVA", "Java Programming Books", 3, lib1, 2);
        BookSection mathSection = new BookSection("SEC-MATH", "Higher Mathematics Books", 4, lib1, 3);
        centralBranch.addSection(javaSection);
        centralBranch.addSection(mathSection);

        Member m1 = new RegularMember("M-01", "Zayan", 4.5, 5, 200.0, 300.0);
        Member m2 = new StudentMember("M-02", "Rima", 4.8, 8, 200.0, 50.0);
        Member m3 = new ResearcherMember("M-03", "Dr. Kabir", 4.9, 8, 200.0, 1000.0);

        m1.setRating(6.5);

        PaymentMethod cash = new CashPayment("LIB-101");
        PaymentMethod card = new CreditCardPayment("4111-XXXX", "EasternBank");
        PaymentMethod bkash = new MobileBankingPayment("bKash", "01900000000");

        try {
            javaSection.borrowBooks(m1, "2026-04-01", "April");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        m1.payMembershipFee(cash, 900.0);
        m2.payMembershipFee(card, 600.0);
        m3.payMembershipFee(bkash, 1600.0);

        try {
            javaSection.borrowBooks(m1, "2026-04-02", "April");
            javaSection.borrowBooks(m2, "2026-04-02", "April");
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            javaSection.borrowBooks(m3, "2026-04-03", "April");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        try {
            mathSection.borrowBooks(m1, "2026-04-04", "April");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        mathSection.setLibraryClosed(true);
        try {
            mathSection.borrowBooks(m2, "2026-04-05", "April");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        List<Member> members = new ArrayList<>();
        members.add(m1);
        members.add(m2);
        members.add(m3);
        for (Member mem : members) {
            System.out.println("[MembershipBill] " + mem.getName() + " (" + mem.getCategory()
                + ", Books: " + mem.getCurrentBorrowedCount() + ") -> BDT " + mem.calculateMembershipBill());
        }

        ReadingActivity printed = new PrintedBookActivity("ACT-BOOK", javaSection, 100.0);
        ReadingActivity journal = new JournalActivity("ACT-JRNL", javaSection, 200.0, 50.0);
        EBookActivity ebook = new EBookActivity("ACT-EBK", javaSection, 80.0, 20.0);

        m1.login("zayan_reader");
        m1.openEBook(ebook.getActivityId());
        m1.submitReview(ebook.getActivityId());

        try {
            printed.submitBookReturn(m1, 100.0);
            journal.submitBookReturn(m2, 90.0);
            ebook.submitBookReturn(m1, 80.0);
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            ebook.submitBookReturn(m1, 80.0);
        } catch (Exception e) {
            System.out.println("[ReturnRejected] " + e.getMessage());
        }

        try {
            printed.submitBookReturn(m3, 70.0);
        } catch (Exception e) {
            System.out.println("[ReturnRejected] " + e.getMessage());
        }

        journal.setReturnTimeExpired(true);
        try {
            journal.submitBookReturn(m1, 95.0);
        } catch (Exception e) {
            System.out.println("[ReturnRejected] " + e.getMessage());
        }

        System.out.println("=== LIBRARY SYSTEM VERIFICATION COMPLETE ===");
    }
}
`;

export const STAGE_3_EXPECTED_OUTPUT = `=== SMART LIBRARY BOOK & MEMBERSHIP MANAGEMENT SYSTEM ===
Before Transfer: L-102: Tania (Archive Officer) - Branch: CENTRAL
[Transfer] Tania transferred from CENTRAL to NORTH
After Transfer: L-102: Tania (Archive Officer) - Branch: NORTH
[Validation] Invalid rating 6.5 for Zayan. Must be between 1.0 and 5.0.
[Rejected] Borrow rejected for Zayan: Membership fee has not been paid
[Cash] Zayan paid BDT 900.0 at Library Desk (Receipt: LIB-101)
[CreditCard] Rima paid BDT 612.0 (with 2% fee) via EasternBank Card 4111-XXXX
[MobileBanking] Dr. Kabir paid BDT 1584.0 (after 1% cashback) via bKash 01900000000
[Borrowed] [April] Zayan borrowed from SEC-JAVA (3 Books) on 2026-04-02
[Borrowed] [April] Rima borrowed from SEC-JAVA (3 Books) on 2026-04-02
[Rejected] Borrow rejected for Dr. Kabir: Section SEC-JAVA copies are all taken
[Rejected] Borrow rejected for Zayan: Exceeded maximum book limit (5)
[Rejected] Borrow rejected for Rima: Library borrowing hours have closed for SEC-MATH
[MembershipBill] Zayan (RegularMember, Books: 3) -> BDT 900.0
[MembershipBill] Rima (StudentMember, Books: 3) -> BDT 300.0
[MembershipBill] Dr. Kabir (ResearcherMember, Books: 0) -> BDT 1000.0
[OnlineReader] Zayan (zayan_reader) logged in.
[OnlineReader] Zayan opened digital material: ACT-EBK
[OnlineReader] Zayan submitted reading log for: ACT-EBK
[BookReturned] PrintedBook (ACT-BOOK) | Member: Zayan | Points: 50.0 | Fee: BDT 100.0
[BookReturned] ResearchJournal (ACT-JRNL) | Member: Rima | Points: 72.0 | Fee: BDT 250.0
[BookReturned] EBook (ACT-EBK) | Member: Zayan | Points: 32.0 | Fee: BDT 100.0
[ReturnRejected] Return rejected for Zayan: Cannot return ACT-EBK more than once
[ReturnRejected] Return rejected for Dr. Kabir: Member did not borrow from SEC-JAVA
[ReturnRejected] Return rejected for Zayan: Return time has expired for ACT-JRNL
=== LIBRARY SYSTEM VERIFICATION COMPLETE ===`;

// ============================================================================
// PROJECT 4: SMART ONLINE SHOPPING & ORDER DELIVERY SYSTEM (~580 LINES)
// ============================================================================
export const STAGE_4_SHOPPING_CODE = `import java.util.*;

// ============================================================================
// PROJECT 4: SMART ONLINE SHOPPING & ORDER DELIVERY SYSTEM
// Full Java OOP Project (~580 Lines)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. CUSTOM EXCEPTIONS (ORDER & DELIVERY REJECTION RULES)
// ----------------------------------------------------------------------------

class ItemLimitExceededException extends Exception {
    public ItemLimitExceededException(String message) {
        super(message);
    }
}

class OutOfStockException extends Exception {
    public OutOfStockException(String message) {
        super(message);
    }
}

class UnpaidOrderException extends Exception {
    public UnpaidOrderException(String message) {
        super(message);
    }
}

class SaleEndedException extends Exception {
    public SaleEndedException(String message) {
        super(message);
    }
}

class UnorderedProductException extends Exception {
    public UnorderedProductException(String message) {
        super(message);
    }
}

class DeliveryTimeExpiredException extends Exception {
    public DeliveryTimeExpiredException(String message) {
        super(message);
    }
}

class DuplicateDeliveryException extends Exception {
    public DuplicateDeliveryException(String message) {
        super(message);
    }
}

// ----------------------------------------------------------------------------
// 2. INTERFACES (ONLINE TRACKING & PAYMENT METHODS)
// ----------------------------------------------------------------------------

interface OnlineTrackable {
    void login(String username);
    void trackOrder(String deliveryId);
    void confirmDelivery(String deliveryId);
}

interface PaymentMethod {
    String getMethodName();
    String processPayment(String customerName, double amount);
}

// ----------------------------------------------------------------------------
// 3. PAYMENT METHOD CLASSES (CASH, CREDIT CARD, MOBILE BANKING)
// ----------------------------------------------------------------------------

class CashPayment implements PaymentMethod {
    private String memoNo;

    public CashPayment(String memoNo) {
        this.memoNo = memoNo;
    }

    @Override
    public String getMethodName() {
        return "Cash";
    }

    @Override
    public String processPayment(String customerName, double amount) {
        return "[Cash] " + customerName + " paid BDT " + amount
            + " via Cash on Delivery (Memo: " + memoNo + ")";
    }
}

class CreditCardPayment implements PaymentMethod {
    private String cardNo;
    private String bankName;

    public CreditCardPayment(String cardNo, String bankName) {
        this.cardNo = cardNo;
        this.bankName = bankName;
    }

    @Override
    public String getMethodName() {
        return "Credit Card";
    }

    @Override
    public String processPayment(String customerName, double amount) {
        double fee = amount * 0.02;
        double total = amount + fee;
        return "[CreditCard] " + customerName + " paid BDT " + total
            + " (with 2% fee) via " + bankName + " Card " + cardNo;
    }
}

class MobileBankingPayment implements PaymentMethod {
    private String appName;
    private String phoneNo;

    public MobileBankingPayment(String appName, String phoneNo) {
        this.appName = appName;
        this.phoneNo = phoneNo;
    }

    @Override
    public String getMethodName() {
        return "Mobile Banking";
    }

    @Override
    public String processPayment(String customerName, double amount) {
        double cashback = amount * 0.01;
        double net = amount - cashback;
        return "[MobileBanking] " + customerName + " paid BDT " + net
            + " (after 1% cashback) via " + appName + " " + phoneNo;
    }
}

// ----------------------------------------------------------------------------
// 4. DELIVERY RIDER & STORE (AGGREGATION — INDEPENDENT LIFECYCLE)
// ----------------------------------------------------------------------------

class DeliveryRider {
    private String riderId;
    private String name;
    private String vehicleType;
    private String currentStore;

    public DeliveryRider(String riderId, String name, String vehicleType) {
        this.riderId = riderId;
        this.name = name;
        this.vehicleType = vehicleType;
        this.currentStore = "NONE";
    }

    public String getRiderId() {
        return riderId;
    }

    public String getName() {
        return name;
    }

    public void setCurrentStore(String store) {
        this.currentStore = store;
    }

    public String getInfo() {
        return riderId + ": " + name + " (" + vehicleType + ") - Store: " + currentStore;
    }
}

class Store {
    private String storeCode;
    private String storeName;
    private List<DeliveryRider> riders;
    private List<Product> products;

    public Store(String storeCode, String storeName) {
        this.storeCode = storeCode;
        this.storeName = storeName;
        this.riders = new ArrayList<>();
        this.products = new ArrayList<>();
    }

    public String getStoreCode() {
        return storeCode;
    }

    public void addRider(DeliveryRider rider) {
        if (!riders.contains(rider)) {
            riders.add(rider);
            rider.setCurrentStore(this.storeCode);
        }
    }

    public void removeRider(DeliveryRider rider) {
        if (riders.remove(rider)) {
            rider.setCurrentStore("NONE");
        }
    }

    public void transferRiderTo(DeliveryRider rider, Store newStore) {
        this.removeRider(rider);
        newStore.addRider(rider);
        System.out.println("[Transfer] " + rider.getName() + " transferred from "
            + this.storeCode + " to " + newStore.getStoreCode());
    }

    public void addProduct(Product p) {
        if (!products.contains(p)) {
            products.add(p);
        }
    }
}

// ----------------------------------------------------------------------------
// 5. CUSTOMER HIERARCHY (ENCAPSULATION, INHERITANCE & POLYMORPHISM)
// ----------------------------------------------------------------------------

abstract class Customer implements OnlineTrackable {
    private String customerId;
    private String name;
    private int loyaltyPoints;
    private int currentOrderedItems;
    private int maxItemLimit;
    private boolean paymentDone;
    private boolean loggedIn;
    private List<OrderRecord> orders;

    public Customer(String customerId, String name, int loyaltyPoints, int maxItemLimit) {
        this.customerId = customerId;
        this.name = name;
        this.currentOrderedItems = 0;
        this.maxItemLimit = maxItemLimit;
        this.paymentDone = false;
        this.loggedIn = false;
        this.orders = new ArrayList<>();
        setLoyaltyPoints(loyaltyPoints);
    }

    // Loyalty points must remain between 0 and 1000
    public void setLoyaltyPoints(int points) {
        if (points < 0 || points > 1000) {
            System.out.println("[Validation] Invalid loyalty points " + points + " for " + name + ". Must be between 0 and 1000.");
            return;
        }
        this.loyaltyPoints = points;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public int getCurrentOrderedItems() {
        return currentOrderedItems;
    }

    public int getMaxItemLimit() {
        return maxItemLimit;
    }

    public boolean isPaymentDone() {
        return paymentDone;
    }

    public void addOrderedItems(int count) {
        this.currentOrderedItems += count;
    }

    public void addOrder(OrderRecord order) {
        this.orders.add(order);
    }

    public void makePayment(PaymentMethod method, double amount) {
        String receipt = method.processPayment(this.name, amount);
        this.paymentDone = true;
        System.out.println(receipt);
    }

    @Override
    public void login(String username) {
        this.loggedIn = true;
        System.out.println("[OrderTracker] " + name + " (" + username + ") logged in.");
    }

    @Override
    public void trackOrder(String deliveryId) {
        if (!loggedIn) {
            System.out.println("[OrderTracker] Please log in first!");
            return;
        }
        System.out.println("[OrderTracker] " + name + " is tracking parcel: " + deliveryId);
    }

    @Override
    public void confirmDelivery(String deliveryId) {
        System.out.println("[OrderTracker] " + name + " confirmed receiving parcel: " + deliveryId);
    }

    public abstract String getCategory();
    public abstract double calculateShoppingBill();
}

class RegularCustomer extends Customer {
    private double pricePerItem;
    private double packingFee;

    public RegularCustomer(String id, String name, int points, int maxItems, double pricePerItem, double packingFee) {
        super(id, name, points, maxItems);
        this.pricePerItem = pricePerItem;
        this.packingFee = packingFee;
    }

    @Override
    public String getCategory() {
        return "RegularCustomer";
    }

    @Override
    public double calculateShoppingBill() {
        return (getCurrentOrderedItems() * pricePerItem) + packingFee;
    }
}

class PrimeCustomer extends Customer {
    private double pricePerItem;
    private double discountPercent;

    public PrimeCustomer(String id, String name, int points, int maxItems, double pricePerItem, double discountPercent) {
        super(id, name, points, maxItems);
        this.pricePerItem = pricePerItem;
        this.discountPercent = discountPercent;
    }

    @Override
    public String getCategory() {
        return "PrimeCustomer";
    }

    @Override
    public double calculateShoppingBill() {
        double total = getCurrentOrderedItems() * pricePerItem;
        return total - (total * (discountPercent / 100.0));
    }
}

class WholesaleCustomer extends Customer {
    private double pricePerItem;
    private double warehouseHandlingFee;

    public WholesaleCustomer(String id, String name, int points, int maxItems, double pricePerItem, double warehouseHandlingFee) {
        super(id, name, points, maxItems);
        this.pricePerItem = pricePerItem;
        this.warehouseHandlingFee = warehouseHandlingFee;
    }

    @Override
    public String getCategory() {
        return "WholesaleCustomer";
    }

    @Override
    public double calculateShoppingBill() {
        return (getCurrentOrderedItems() * pricePerItem) + warehouseHandlingFee;
    }
}

// ----------------------------------------------------------------------------
// 6. PRODUCT & ORDER RECORD (ASSOCIATION & COMPOSITION)
// ----------------------------------------------------------------------------

class OrderRecord {
    private Customer customer;
    private Product product;
    private String orderDate;
    private String invoiceNo;

    public OrderRecord(Customer customer, Product product, String orderDate, String invoiceNo) {
        this.customer = customer;
        this.product = product;
        this.orderDate = orderDate;
        this.invoiceNo = invoiceNo;
    }

    public Customer getCustomer() {
        return customer;
    }

    public String getSummary() {
        return "[" + invoiceNo + "] " + customer.getName() + " ordered "
            + product.getProductCode() + " (" + product.getBundleQty() + " Items) on " + orderDate;
    }
}

class Product {
    private String productCode;
    private String title;
    private int bundleQty;
    private DeliveryRider assignedRider;
    private int maxStockOrders;
    private boolean saleEnded;
    private List<OrderRecord> orders;

    public Product(String productCode, String title, int bundleQty, DeliveryRider assignedRider, int maxStockOrders) {
        this.productCode = productCode;
        this.title = title;
        this.bundleQty = bundleQty;
        this.assignedRider = assignedRider;
        this.maxStockOrders = maxStockOrders;
        this.saleEnded = false;
        this.orders = new ArrayList<>();
    }

    public String getProductCode() {
        return productCode;
    }

    public int getBundleQty() {
        return bundleQty;
    }

    public void setSaleEnded(boolean ended) {
        this.saleEnded = ended;
    }

    public boolean hasCustomerOrdered(Customer c) {
        for (OrderRecord ord : orders) {
            if (ord.getCustomer().getCustomerId().equals(c.getCustomerId())) {
                return true;
            }
        }
        return false;
    }

    public OrderRecord placeOrder(Customer customer, String date, String invoiceNo)
            throws ItemLimitExceededException, OutOfStockException,
                   UnpaidOrderException, SaleEndedException {

        if (saleEnded) {
            throw new SaleEndedException(
                "Order rejected for " + customer.getName() + ": Sale time has ended for " + productCode
            );
        }

        if (!customer.isPaymentDone()) {
            throw new UnpaidOrderException(
                "Order rejected for " + customer.getName() + ": Payment has not been completed"
            );
        }

        if (orders.size() >= maxStockOrders) {
            throw new OutOfStockException(
                "Order rejected for " + customer.getName() + ": Product " + productCode + " is out of stock"
            );
        }

        if (customer.getCurrentOrderedItems() + this.bundleQty > customer.getMaxItemLimit()) {
            throw new ItemLimitExceededException(
                "Order rejected for " + customer.getName() + ": Exceeded maximum item limit (" + customer.getMaxItemLimit() + ")"
            );
        }

        OrderRecord ord = new OrderRecord(customer, this, date, invoiceNo);
        orders.add(ord);
        customer.addOrderedItems(this.bundleQty);
        customer.addOrder(ord);

        System.out.println("[Ordered] " + ord.getSummary());
        return ord;
    }
}

// ----------------------------------------------------------------------------
// 7. DELIVERY SERVICE HIERARCHY (STANDARD, EXPRESS, DRONE DELIVERY)
// ----------------------------------------------------------------------------

abstract class DeliveryService {
    private String deliveryId;
    private Product product;
    private double baseCharge;
    private boolean timeWindowExpired;
    private List<String> deliveredCustomerIds;

    public DeliveryService(String deliveryId, Product product, double baseCharge) {
        this.deliveryId = deliveryId;
        this.product = product;
        this.baseCharge = baseCharge;
        this.timeWindowExpired = false;
        this.deliveredCustomerIds = new ArrayList<>();
    }

    public String getDeliveryId() {
        return deliveryId;
    }

    public double getBaseCharge() {
        return baseCharge;
    }

    public void setTimeWindowExpired(boolean expired) {
        this.timeWindowExpired = expired;
    }

    public abstract String getDeliveryType();
    public abstract double calculateDeliveryFee();
    public abstract double calculateRewardPoints(double baseScore);

    public void completeDelivery(Customer customer, double baseScore)
            throws UnorderedProductException, DeliveryTimeExpiredException, DuplicateDeliveryException {

        if (!product.hasCustomerOrdered(customer)) {
            throw new UnorderedProductException(
                "Delivery rejected for " + customer.getName() + ": Customer did not order " + product.getProductCode()
            );
        }

        if (timeWindowExpired) {
            throw new DeliveryTimeExpiredException(
                "Delivery rejected for " + customer.getName() + ": Delivery time window has expired for " + deliveryId
            );
        }

        if (deliveredCustomerIds.contains(customer.getCustomerId())) {
            throw new DuplicateDeliveryException(
                "Delivery rejected for " + customer.getName() + ": Cannot confirm " + deliveryId + " more than once"
            );
        }

        deliveredCustomerIds.add(customer.getCustomerId());
        double reward = calculateRewardPoints(baseScore);
        System.out.println("[Delivered] " + getDeliveryType() + " (" + deliveryId + ") | Customer: "
            + customer.getName() + " | Reward Points: " + reward + " | Fee: BDT " + calculateDeliveryFee());
    }
}

class StandardDelivery extends DeliveryService {
    public StandardDelivery(String id, Product product, double baseCharge) {
        super(id, product, baseCharge);
    }

    @Override
    public String getDeliveryType() {
        return "StandardDelivery";
    }

    @Override
    public double calculateDeliveryFee() {
        return getBaseCharge();
    }

    @Override
    public double calculateRewardPoints(double baseScore) {
        return baseScore * 0.50;
    }
}

class ExpressDelivery extends DeliveryService {
    private double speedCharge;

    public ExpressDelivery(String id, Product product, double baseCharge, double speedCharge) {
        super(id, product, baseCharge);
        this.speedCharge = speedCharge;
    }

    @Override
    public String getDeliveryType() {
        return "ExpressDelivery";
    }

    @Override
    public double calculateDeliveryFee() {
        return getBaseCharge() + speedCharge;
    }

    @Override
    public double calculateRewardPoints(double baseScore) {
        return baseScore * 0.80;
    }
}

class DroneDelivery extends DeliveryService {
    private double airNavigationFee;

    public DroneDelivery(String id, Product product, double baseCharge, double airNavigationFee) {
        super(id, product, baseCharge);
        this.airNavigationFee = airNavigationFee;
    }

    @Override
    public String getDeliveryType() {
        return "DroneDelivery";
    }

    @Override
    public double calculateDeliveryFee() {
        return getBaseCharge() + airNavigationFee;
    }

    @Override
    public double calculateRewardPoints(double baseScore) {
        return baseScore * 1.20;
    }
}

// ----------------------------------------------------------------------------
// 8. MAIN CLASS (SYSTEM TEST & DEMONSTRATION)
// ----------------------------------------------------------------------------

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SMART ONLINE SHOPPING & ORDER DELIVERY SYSTEM ===");

        Store dhakaStore = new Store("DHAKA", "Dhaka Electronics Store");
        Store sylhetStore = new Store("SYLHET", "Sylhet Gadget Hub");

        DeliveryRider r1 = new DeliveryRider("R-101", "Imran", "Motorbike");
        DeliveryRider r2 = new DeliveryRider("R-102", "Sadia", "Electric Van");

        dhakaStore.addRider(r1);
        dhakaStore.addRider(r2);
        System.out.println("Before Transfer: " + r2.getInfo());

        dhakaStore.transferRiderTo(r2, sylhetStore);
        System.out.println("After Transfer: " + r2.getInfo());

        Product laptopPack = new Product("PRD-LAP", "Laptop Accessory Bundle", 3, r1, 2);
        Product phonePack = new Product("PRD-PHN", "Smartphone Combo Pack", 4, r1, 3);
        dhakaStore.addProduct(laptopPack);
        dhakaStore.addProduct(phonePack);

        Customer c1 = new RegularCustomer("C-01", "Tanvir", 500, 5, 1000.0, 200.0);
        Customer c2 = new PrimeCustomer("C-02", "Mim", 850, 8, 1000.0, 50.0);
        Customer c3 = new WholesaleCustomer("C-03", "Rohan", 700, 8, 1000.0, 1500.0);

        c1.setLoyaltyPoints(1500);

        PaymentMethod cash = new CashPayment("MEMO-101");
        PaymentMethod card = new CreditCardPayment("4500-XXXX", "DutchBangla");
        PaymentMethod bkash = new MobileBankingPayment("bKash", "01600000000");

        try {
            laptopPack.placeOrder(c1, "2026-05-01", "INV-101");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        c1.makePayment(cash, 3200.0);
        c2.makePayment(card, 3000.0);
        c3.makePayment(bkash, 4500.0);

        try {
            laptopPack.placeOrder(c1, "2026-05-02", "INV-101");
            laptopPack.placeOrder(c2, "2026-05-02", "INV-102");
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            laptopPack.placeOrder(c3, "2026-05-03", "INV-103");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        try {
            phonePack.placeOrder(c1, "2026-05-04", "INV-201");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        phonePack.setSaleEnded(true);
        try {
            phonePack.placeOrder(c2, "2026-05-05", "INV-202");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        List<Customer> customers = new ArrayList<>();
        customers.add(c1);
        customers.add(c2);
        customers.add(c3);
        for (Customer cust : customers) {
            System.out.println("[ShoppingBill] " + cust.getName() + " (" + cust.getCategory()
                + ", Items: " + cust.getCurrentOrderedItems() + ") -> BDT " + cust.calculateShoppingBill());
        }

        DeliveryService stdDel = new StandardDelivery("DEL-STD", laptopPack, 100.0);
        DeliveryService expDel = new ExpressDelivery("DEL-EXP", laptopPack, 200.0, 100.0);
        DroneDelivery droneDel = new DroneDelivery("DEL-DRN", laptopPack, 300.0, 150.0);

        c1.login("tanvir_shop");
        c1.trackOrder(droneDel.getDeliveryId());
        c1.confirmDelivery(droneDel.getDeliveryId());

        try {
            stdDel.completeDelivery(c1, 80.0);
            expDel.completeDelivery(c2, 90.0);
            droneDel.completeDelivery(c1, 100.0);
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            droneDel.completeDelivery(c1, 100.0);
        } catch (Exception e) {
            System.out.println("[DeliveryRejected] " + e.getMessage());
        }

        try {
            stdDel.completeDelivery(c3, 80.0);
        } catch (Exception e) {
            System.out.println("[DeliveryRejected] " + e.getMessage());
        }

        expDel.setTimeWindowExpired(true);
        try {
            expDel.completeDelivery(c1, 90.0);
        } catch (Exception e) {
            System.out.println("[DeliveryRejected] " + e.getMessage());
        }

        System.out.println("=== SHOPPING SYSTEM VERIFICATION COMPLETE ===");
    }
}
`;

export const STAGE_4_EXPECTED_OUTPUT = `=== SMART ONLINE SHOPPING & ORDER DELIVERY SYSTEM ===
Before Transfer: R-102: Sadia (Electric Van) - Store: DHAKA
[Transfer] Sadia transferred from DHAKA to SYLHET
After Transfer: R-102: Sadia (Electric Van) - Store: SYLHET
[Validation] Invalid loyalty points 1500 for Tanvir. Must be between 0 and 1000.
[Rejected] Order rejected for Tanvir: Payment has not been completed
[Cash] Tanvir paid BDT 3200.0 via Cash on Delivery (Memo: MEMO-101)
[CreditCard] Mim paid BDT 3060.0 (with 2% fee) via DutchBangla Card 4500-XXXX
[MobileBanking] Rohan paid BDT 4455.0 (after 1% cashback) via bKash 01600000000
[Ordered] [INV-101] Tanvir ordered PRD-LAP (3 Items) on 2026-05-02
[Ordered] [INV-102] Mim ordered PRD-LAP (3 Items) on 2026-05-02
[Rejected] Order rejected for Rohan: Product PRD-LAP is out of stock
[Rejected] Order rejected for Tanvir: Exceeded maximum item limit (5)
[Rejected] Order rejected for Mim: Sale time has ended for PRD-PHN
[ShoppingBill] Tanvir (RegularCustomer, Items: 3) -> BDT 3200.0
[ShoppingBill] Mim (PrimeCustomer, Items: 3) -> BDT 1500.0
[ShoppingBill] Rohan (WholesaleCustomer, Items: 0) -> BDT 1500.0
[OrderTracker] Tanvir (tanvir_shop) logged in.
[OrderTracker] Tanvir is tracking parcel: DEL-DRN
[OrderTracker] Tanvir confirmed receiving parcel: DEL-DRN
[Delivered] StandardDelivery (DEL-STD) | Customer: Tanvir | Reward Points: 40.0 | Fee: BDT 100.0
[Delivered] ExpressDelivery (DEL-EXP) | Customer: Mim | Reward Points: 72.0 | Fee: BDT 300.0
[Delivered] DroneDelivery (DEL-DRN) | Customer: Tanvir | Reward Points: 120.0 | Fee: BDT 450.0
[DeliveryRejected] Delivery rejected for Tanvir: Cannot confirm DEL-DRN more than once
[DeliveryRejected] Delivery rejected for Rohan: Customer did not order PRD-LAP
[DeliveryRejected] Delivery rejected for Tanvir: Delivery time window has expired for DEL-EXP
=== SHOPPING SYSTEM VERIFICATION COMPLETE ===`;

// ============================================================================
// PROJECT 5: SMART HOTEL ROOM BOOKING & GUEST MANAGEMENT SYSTEM (~580 LINES)
// ============================================================================
export const STAGE_5_HOTEL_CODE = `import java.util.*;

// ============================================================================
// PROJECT 5: SMART HOTEL ROOM BOOKING & GUEST MANAGEMENT SYSTEM
// Full Java OOP Project (~580 Lines)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. CUSTOM EXCEPTIONS (ROOM BOOKING & HOTEL SERVICE REJECTION RULES)
// ----------------------------------------------------------------------------

class NightLimitExceededException extends Exception {
    public NightLimitExceededException(String message) {
        super(message);
    }
}

class RoomAlreadyBookedException extends Exception {
    public RoomAlreadyBookedException(String message) {
        super(message);
    }
}

class UnpaidBookingFeeException extends Exception {
    public UnpaidBookingFeeException(String message) {
        super(message);
    }
}

class BookingDeadlinePassedException extends Exception {
    public BookingDeadlinePassedException(String message) {
        super(message);
    }
}

class UnregisteredGuestServiceException extends Exception {
    public UnregisteredGuestServiceException(String message) {
        super(message);
    }
}

class ServiceTimeExpiredException extends Exception {
    public ServiceTimeExpiredException(String message) {
        super(message);
    }
}

class DuplicateServiceRequestException extends Exception {
    public DuplicateServiceRequestException(String message) {
        super(message);
    }
}

// ----------------------------------------------------------------------------
// 2. INTERFACES (SMART KEY ACCESS & PAYMENT METHODS)
// ----------------------------------------------------------------------------

interface SmartKeyCapable {
    void login(String appUser);
    void unlockDoor(String serviceId);
    void requestCheckout(String serviceId);
}

interface PaymentMethod {
    String getMethodName();
    String processPayment(String guestName, double amount);
}

// ----------------------------------------------------------------------------
// 3. PAYMENT METHOD CLASSES (CASH, CREDIT CARD, MOBILE BANKING)
// ----------------------------------------------------------------------------

class CashPayment implements PaymentMethod {
    private String voucherNo;

    public CashPayment(String voucherNo) {
        this.voucherNo = voucherNo;
    }

    @Override
    public String getMethodName() {
        return "Cash";
    }

    @Override
    public String processPayment(String guestName, double amount) {
        return "[Cash] " + guestName + " paid BDT " + amount
            + " at Hotel Reception (Voucher: " + voucherNo + ")";
    }
}

class CreditCardPayment implements PaymentMethod {
    private String cardNo;
    private String bankName;

    public CreditCardPayment(String cardNo, String bankName) {
        this.cardNo = cardNo;
        this.bankName = bankName;
    }

    @Override
    public String getMethodName() {
        return "Credit Card";
    }

    @Override
    public String processPayment(String guestName, double amount) {
        double fee = amount * 0.02;
        double total = amount + fee;
        return "[CreditCard] " + guestName + " paid BDT " + total
            + " (with 2% fee) via " + bankName + " Card " + cardNo;
    }
}

class MobileBankingPayment implements PaymentMethod {
    private String appName;
    private String phoneNo;

    public MobileBankingPayment(String appName, String phoneNo) {
        this.appName = appName;
        this.phoneNo = phoneNo;
    }

    @Override
    public String getMethodName() {
        return "Mobile Banking";
    }

    @Override
    public String processPayment(String guestName, double amount) {
        double cashback = amount * 0.01;
        double net = amount - cashback;
        return "[MobileBanking] " + guestName + " paid BDT " + net
            + " (after 1% cashback) via " + appName + " " + phoneNo;
    }
}

// ----------------------------------------------------------------------------
// 4. HOTEL STAFF & HOTEL BRANCH (AGGREGATION — INDEPENDENT LIFECYCLE)
// ----------------------------------------------------------------------------

class HotelStaff {
    private String staffId;
    private String name;
    private String position;
    private String currentBranch;

    public HotelStaff(String staffId, String name, String position) {
        this.staffId = staffId;
        this.name = name;
        this.position = position;
        this.currentBranch = "NONE";
    }

    public String getStaffId() {
        return staffId;
    }

    public String getName() {
        return name;
    }

    public void setCurrentBranch(String branch) {
        this.currentBranch = branch;
    }

    public String getInfo() {
        return staffId + ": " + name + " (" + position + ") - Branch: " + currentBranch;
    }
}

class HotelBranch {
    private String branchCode;
    private String branchName;
    private List<HotelStaff> staffList;
    private List<RoomPackage> rooms;

    public HotelBranch(String branchCode, String branchName) {
        this.branchCode = branchCode;
        this.branchName = branchName;
        this.staffList = new ArrayList<>();
        this.rooms = new ArrayList<>();
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void addStaff(HotelStaff staff) {
        if (!staffList.contains(staff)) {
            staffList.add(staff);
            staff.setCurrentBranch(this.branchCode);
        }
    }

    public void removeStaff(HotelStaff staff) {
        if (staffList.remove(staff)) {
            staff.setCurrentBranch("NONE");
        }
    }

    public void transferStaffTo(HotelStaff staff, HotelBranch newBranch) {
        this.removeStaff(staff);
        newBranch.addStaff(staff);
        System.out.println("[Transfer] " + staff.getName() + " transferred from "
            + this.branchCode + " to " + newBranch.getBranchCode());
    }

    public void addRoomPackage(RoomPackage room) {
        if (!rooms.contains(room)) {
            rooms.add(room);
        }
    }
}

// ----------------------------------------------------------------------------
// 5. GUEST HIERARCHY (ENCAPSULATION, INHERITANCE & POLYMORPHISM)
// ----------------------------------------------------------------------------

abstract class Guest implements SmartKeyCapable {
    private String guestId;
    private String name;
    private double reviewRating;
    private int currentBookedNights;
    private int maxNightLimit;
    private boolean advancePaid;
    private boolean loggedIn;
    private List<StayReservation> reservations;

    public Guest(String guestId, String name, double reviewRating, int maxNightLimit) {
        this.guestId = guestId;
        this.name = name;
        this.currentBookedNights = 0;
        this.maxNightLimit = maxNightLimit;
        this.advancePaid = false;
        this.loggedIn = false;
        this.reservations = new ArrayList<>();
        setReviewRating(reviewRating);
    }

    // Review rating must remain between 1.0 and 5.0
    public void setReviewRating(double rating) {
        if (rating < 1.0 || rating > 5.0) {
            System.out.println("[Validation] Invalid rating " + rating + " for " + name + ". Must be between 1.0 and 5.0.");
            return;
        }
        this.reviewRating = rating;
    }

    public String getGuestId() {
        return guestId;
    }

    public String getName() {
        return name;
    }

    public int getCurrentBookedNights() {
        return currentBookedNights;
    }

    public int getMaxNightLimit() {
        return maxNightLimit;
    }

    public boolean isAdvancePaid() {
        return advancePaid;
    }

    public void addNights(int nights) {
        this.currentBookedNights += nights;
    }

    public void addReservation(StayReservation res) {
        this.reservations.add(res);
    }

    public void payAdvance(PaymentMethod method, double amount) {
        String receipt = method.processPayment(this.name, amount);
        this.advancePaid = true;
        System.out.println(receipt);
    }

    @Override
    public void login(String appUser) {
        this.loggedIn = true;
        System.out.println("[SmartKey] " + name + " (" + appUser + ") logged in.");
    }

    @Override
    public void unlockDoor(String serviceId) {
        if (!loggedIn) {
            System.out.println("[SmartKey] Please log in first!");
            return;
        }
        System.out.println("[SmartKey] " + name + " unlocked room door for: " + serviceId);
    }

    @Override
    public void requestCheckout(String serviceId) {
        System.out.println("[SmartKey] " + name + " completed digital checkout for: " + serviceId);
    }

    public abstract String getCategory();
    public abstract double calculateRoomRent();
}

class RegularGuest extends Guest {
    private double perNightRate;
    private double breakfastFee;

    public RegularGuest(String id, String name, double rating, int maxNights, double perNightRate, double breakfastFee) {
        super(id, name, rating, maxNights);
        this.perNightRate = perNightRate;
        this.breakfastFee = breakfastFee;
    }

    @Override
    public String getCategory() {
        return "RegularGuest";
    }

    @Override
    public double calculateRoomRent() {
        return (getCurrentBookedNights() * perNightRate) + breakfastFee;
    }
}

class VIPGuest extends Guest {
    private double perNightRate;
    private double discountPercent;

    public VIPGuest(String id, String name, double rating, int maxNights, double perNightRate, double discountPercent) {
        super(id, name, rating, maxNights);
        this.perNightRate = perNightRate;
        this.discountPercent = discountPercent;
    }

    @Override
    public String getCategory() {
        return "VIPGuest";
    }

    @Override
    public double calculateRoomRent() {
        double total = getCurrentBookedNights() * perNightRate;
        return total - (total * (discountPercent / 100.0));
    }
}

class CorporateGuest extends Guest {
    private double perNightRate;
    private double conferenceHallFee;

    public CorporateGuest(String id, String name, double rating, int maxNights, double perNightRate, double conferenceHallFee) {
        super(id, name, rating, maxNights);
        this.perNightRate = perNightRate;
        this.conferenceHallFee = conferenceHallFee;
    }

    @Override
    public String getCategory() {
        return "CorporateGuest";
    }

    @Override
    public double calculateRoomRent() {
        return (getCurrentBookedNights() * perNightRate) + conferenceHallFee;
    }
}

// ----------------------------------------------------------------------------
// 6. ROOM PACKAGE & STAY RESERVATION (ASSOCIATION & COMPOSITION)
// ----------------------------------------------------------------------------

class StayReservation {
    private Guest guest;
    private RoomPackage room;
    private String checkInDate;
    private String season;

    public StayReservation(Guest guest, RoomPackage room, String checkInDate, String season) {
        this.guest = guest;
        this.room = room;
        this.checkInDate = checkInDate;
        this.season = season;
    }

    public Guest getGuest() {
        return guest;
    }

    public String getSummary() {
        return "[" + season + "] " + guest.getName() + " booked "
            + room.getRoomCode() + " (" + room.getPackageNights() + " Nights) on " + checkInDate;
    }
}

class RoomPackage {
    private String roomCode;
    private String roomTitle;
    private int packageNights;
    private HotelStaff manager;
    private int maxBookings;
    private boolean deadlinePassed;
    private List<StayReservation> reservations;

    public RoomPackage(String roomCode, String roomTitle, int packageNights, HotelStaff manager, int maxBookings) {
        this.roomCode = roomCode;
        this.roomTitle = roomTitle;
        this.packageNights = packageNights;
        this.manager = manager;
        this.maxBookings = maxBookings;
        this.deadlinePassed = false;
        this.reservations = new ArrayList<>();
    }

    public String getRoomCode() {
        return roomCode;
    }

    public int getPackageNights() {
        return packageNights;
    }

    public void setDeadlinePassed(boolean passed) {
        this.deadlinePassed = passed;
    }

    public boolean isGuestBooked(Guest g) {
        for (StayReservation res : reservations) {
            if (res.getGuest().getGuestId().equals(g.getGuestId())) {
                return true;
            }
        }
        return false;
    }

    public StayReservation bookRoom(Guest guest, String date, String season)
            throws NightLimitExceededException, RoomAlreadyBookedException,
                   UnpaidBookingFeeException, BookingDeadlinePassedException {

        if (deadlinePassed) {
            throw new BookingDeadlinePassedException(
                "Booking rejected for " + guest.getName() + ": Booking deadline has passed for " + roomCode
            );
        }

        if (!guest.isAdvancePaid()) {
            throw new UnpaidBookingFeeException(
                "Booking rejected for " + guest.getName() + ": Advance booking fee has not been paid"
            );
        }

        if (reservations.size() >= maxBookings) {
            throw new RoomAlreadyBookedException(
                "Booking rejected for " + guest.getName() + ": Room " + roomCode + " is already booked"
            );
        }

        if (guest.getCurrentBookedNights() + this.packageNights > guest.getMaxNightLimit()) {
            throw new NightLimitExceededException(
                "Booking rejected for " + guest.getName() + ": Exceeded maximum stay limit (" + guest.getMaxNightLimit() + ")"
            );
        }

        StayReservation res = new StayReservation(guest, this, date, season);
        reservations.add(res);
        guest.addNights(this.packageNights);
        guest.addReservation(res);

        System.out.println("[RoomBooked] " + res.getSummary());
        return res;
    }
}

// ----------------------------------------------------------------------------
// 7. HOTEL SERVICE HIERARCHY (DINING, LAUNDRY, SPA SERVICE)
// ----------------------------------------------------------------------------

abstract class HotelService {
    private String serviceId;
    private RoomPackage room;
    private double basePrice;
    private boolean serviceTimeExpired;
    private List<String> servedGuestIds;

    public HotelService(String serviceId, RoomPackage room, double basePrice) {
        this.serviceId = serviceId;
        this.room = room;
        this.basePrice = basePrice;
        this.serviceTimeExpired = false;
        this.servedGuestIds = new ArrayList<>();
    }

    public String getServiceId() {
        return serviceId;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setServiceTimeExpired(boolean expired) {
        this.serviceTimeExpired = expired;
    }

    public abstract String getServiceType();
    public abstract double calculateServiceCharge();
    public abstract double calculateLoyaltyPoints(double rawPoints);

    public void requestService(Guest guest, double rawPoints)
            throws UnregisteredGuestServiceException, ServiceTimeExpiredException, DuplicateServiceRequestException {

        if (!room.isGuestBooked(guest)) {
            throw new UnregisteredGuestServiceException(
                "Service rejected for " + guest.getName() + ": Guest has not booked " + room.getRoomCode()
            );
        }

        if (serviceTimeExpired) {
            throw new ServiceTimeExpiredException(
                "Service rejected for " + guest.getName() + ": Service hours have expired for " + serviceId
            );
        }

        if (servedGuestIds.contains(guest.getGuestId())) {
            throw new DuplicateServiceRequestException(
                "Service rejected for " + guest.getName() + ": Cannot request " + serviceId + " more than once"
            );
        }

        servedGuestIds.add(guest.getGuestId());
        double points = calculateLoyaltyPoints(rawPoints);
        System.out.println("[ServiceCompleted] " + getServiceType() + " (" + serviceId + ") | Guest: "
            + guest.getName() + " | Points: " + points + " | Charge: BDT " + calculateServiceCharge());
    }
}

class DiningService extends HotelService {
    public DiningService(String id, RoomPackage room, double basePrice) {
        super(id, room, basePrice);
    }

    @Override
    public String getServiceType() {
        return "DiningService";
    }

    @Override
    public double calculateServiceCharge() {
        return getBasePrice();
    }

    @Override
    public double calculateLoyaltyPoints(double rawPoints) {
        return rawPoints * 0.50;
    }
}

class SpaService extends HotelService {
    private double wellnessRoomFee;

    public SpaService(String id, RoomPackage room, double basePrice, double wellnessRoomFee) {
        super(id, room, basePrice);
        this.wellnessRoomFee = wellnessRoomFee;
    }

    @Override
    public String getServiceType() {
        return "SpaService";
    }

    @Override
    public double calculateServiceCharge() {
        return getBasePrice() + wellnessRoomFee;
    }

    @Override
    public double calculateLoyaltyPoints(double rawPoints) {
        return rawPoints * 0.80;
    }
}

class LaundryService extends HotelService {
    private double expressIroningFee;

    public LaundryService(String id, RoomPackage room, double basePrice, double expressIroningFee) {
        super(id, room, basePrice);
        this.expressIroningFee = expressIroningFee;
    }

    @Override
    public String getServiceType() {
        return "LaundryService";
    }

    @Override
    public double calculateServiceCharge() {
        return getBasePrice() + expressIroningFee;
    }

    @Override
    public double calculateLoyaltyPoints(double rawPoints) {
        return rawPoints * 0.30;
    }
}

// ----------------------------------------------------------------------------
// 8. MAIN CLASS (SYSTEM TEST & DEMONSTRATION)
// ----------------------------------------------------------------------------

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SMART HOTEL ROOM BOOKING & GUEST MANAGEMENT SYSTEM ===");

        HotelBranch coxsBranch = new HotelBranch("COXS", "Coxs Bazar Sea Resort");
        HotelBranch sylhetBranch = new HotelBranch("SYLH", "Sylhet Tea Valley Resort");

        HotelStaff st1 = new HotelStaff("ST-101", "Arif", "General Manager");
        HotelStaff st2 = new HotelStaff("ST-102", "Mona", "Front Desk Supervisor");

        coxsBranch.addStaff(st1);
        coxsBranch.addStaff(st2);
        System.out.println("Before Transfer: " + st2.getInfo());

        coxsBranch.transferStaffTo(st2, sylhetBranch);
        System.out.println("After Transfer: " + st2.getInfo());

        RoomPackage deluxeRoom = new RoomPackage("RM-101", "Deluxe Ocean View", 3, st1, 2);
        RoomPackage suiteRoom = new RoomPackage("RM-202", "Presidential Suite", 4, st1, 3);
        coxsBranch.addRoomPackage(deluxeRoom);
        coxsBranch.addRoomPackage(suiteRoom);

        Guest g1 = new RegularGuest("G-01", "Nabil", 4.5, 5, 4000.0, 1000.0);
        Guest g2 = new VIPGuest("G-02", "Sara", 4.9, 8, 4000.0, 50.0);
        Guest g3 = new CorporateGuest("G-03", "Mr. David", 4.7, 8, 4000.0, 3000.0);

        g1.setReviewRating(6.0);

        PaymentMethod cash = new CashPayment("VCH-101");
        PaymentMethod card = new CreditCardPayment("4900-XXXX", "PrimeBank");
        PaymentMethod bkash = new MobileBankingPayment("bKash", "01500000000");

        try {
            deluxeRoom.bookRoom(g1, "2026-06-01", "Summer");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        g1.payAdvance(cash, 13000.0);
        g2.payAdvance(card, 12000.0);
        g3.payAdvance(bkash, 15000.0);

        try {
            deluxeRoom.bookRoom(g1, "2026-06-02", "Summer");
            deluxeRoom.bookRoom(g2, "2026-06-02", "Summer");
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            deluxeRoom.bookRoom(g3, "2026-06-03", "Summer");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        try {
            suiteRoom.bookRoom(g1, "2026-06-04", "Summer");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        suiteRoom.setDeadlinePassed(true);
        try {
            suiteRoom.bookRoom(g2, "2026-06-05", "Summer");
        } catch (Exception e) {
            System.out.println("[Rejected] " + e.getMessage());
        }

        List<Guest> guests = new ArrayList<>();
        guests.add(g1);
        guests.add(g2);
        guests.add(g3);
        for (Guest gst : guests) {
            System.out.println("[RoomRent] " + gst.getName() + " (" + gst.getCategory()
                + ", Nights: " + gst.getCurrentBookedNights() + ") -> BDT " + gst.calculateRoomRent());
        }

        HotelService dining = new DiningService("SRV-DINE", deluxeRoom, 1200.0);
        HotelService spa = new SpaService("SRV-SPA", deluxeRoom, 2500.0, 500.0);
        LaundryService laundry = new LaundryService("SRV-LAUN", deluxeRoom, 600.0, 200.0);

        g1.login("nabil_guest");
        g1.unlockDoor(laundry.getServiceId());
        g1.requestCheckout(laundry.getServiceId());

        try {
            dining.requestService(g1, 80.0);
            spa.requestService(g2, 90.0);
            laundry.requestService(g1, 100.0);
        } catch (Exception e) {
            System.out.println("[Error] " + e.getMessage());
        }

        try {
            laundry.requestService(g1, 100.0);
        } catch (Exception e) {
            System.out.println("[ServiceRejected] " + e.getMessage());
        }

        try {
            dining.requestService(g3, 80.0);
        } catch (Exception e) {
            System.out.println("[ServiceRejected] " + e.getMessage());
        }

        spa.setServiceTimeExpired(true);
        try {
            spa.requestService(g1, 90.0);
        } catch (Exception e) {
            System.out.println("[ServiceRejected] " + e.getMessage());
        }

        System.out.println("=== HOTEL SYSTEM VERIFICATION COMPLETE ===");
    }
}
`;

export const STAGE_5_EXPECTED_OUTPUT = `=== SMART HOTEL ROOM BOOKING & GUEST MANAGEMENT SYSTEM ===
Before Transfer: ST-102: Mona (Front Desk Supervisor) - Branch: COXS
[Transfer] Mona transferred from COXS to SYLH
After Transfer: ST-102: Mona (Front Desk Supervisor) - Branch: SYLH
[Validation] Invalid rating 6.0 for Nabil. Must be between 1.0 and 5.0.
[Rejected] Booking rejected for Nabil: Advance booking fee has not been paid
[Cash] Nabil paid BDT 13000.0 at Hotel Reception (Voucher: VCH-101)
[CreditCard] Sara paid BDT 12240.0 (with 2% fee) via PrimeBank Card 4900-XXXX
[MobileBanking] Mr. David paid BDT 14850.0 (after 1% cashback) via bKash 01500000000
[RoomBooked] [Summer] Nabil booked RM-101 (3 Nights) on 2026-06-02
[RoomBooked] [Summer] Sara booked RM-101 (3 Nights) on 2026-06-02
[Rejected] Booking rejected for Mr. David: Room RM-101 is already booked
[Rejected] Booking rejected for Nabil: Exceeded maximum stay limit (5)
[Rejected] Booking rejected for Sara: Booking deadline has passed for RM-202
[RoomRent] Nabil (RegularGuest, Nights: 3) -> BDT 13000.0
[RoomRent] Sara (VIPGuest, Nights: 3) -> BDT 6000.0
[RoomRent] Mr. David (CorporateGuest, Nights: 0) -> BDT 3000.0
[SmartKey] Nabil (nabil_guest) logged in.
[SmartKey] Nabil unlocked room door for: SRV-LAUN
[SmartKey] Nabil completed digital checkout for: SRV-LAUN
[ServiceCompleted] DiningService (SRV-DINE) | Guest: Nabil | Points: 40.0 | Charge: BDT 1200.0
[ServiceCompleted] SpaService (SRV-SPA) | Guest: Sara | Points: 72.0 | Charge: BDT 3000.0
[ServiceCompleted] LaundryService (SRV-LAUN) | Guest: Nabil | Points: 30.0 | Charge: BDT 800.0
[ServiceRejected] Service rejected for Nabil: Cannot request SRV-LAUN more than once
[ServiceRejected] Service rejected for Mr. David: Guest has not booked RM-101
[ServiceRejected] Service rejected for Nabil: Service hours have expired for SRV-SPA
=== HOTEL SYSTEM VERIFICATION COMPLETE ===`;

export const ETERNAL_KINGDOM_CAPSTONES: CapstoneStageSpec[] = [
  {
    stageNumber: 1,
    title: 'Project 1: Smart University Examination & Course Management System',
    topic: 'Students, Teachers, Courses & Online Exams',
    lineCountBadge: 'Full OOP System',
    problemStatement: `A university wants to develop a Smart Examination Management System that manages students, teachers, departments, courses, examinations, registrations, and online exams.

A Student has a student ID, name, email, CGPA, and current credit load. These details must be protected from direct access. The CGPA must remain between 0.00 and 4.00, and a student cannot register for courses if their total registered credits exceed the university's maximum credit limit.

The university contains several Department objects. Each department has multiple teachers. However, teachers are university employees and may be transferred from one department to another. A teacher therefore must be able to exist independently of a particular department.

Each department offers several courses. A course contains its course code, title, credit, and instructor. Students can register for multiple courses, and a course can contain multiple students. Whenever a student registers for a course, a CourseRegistration object is created containing the registration date, semester, and grade. A registration is meaningful only for that particular student-course relationship.

The university has different categories of students: RegularStudent, ScholarshipStudent, InternationalStudent. All students must calculate their semester fee, but the calculation differs for each category.

The university also conducts different examinations: MidtermExam, FinalExam, OnlineExam. Each examination has common properties, but the way marks and examination fees are calculated differs depending on the examination type. Some students are allowed to take online examinations. Any class capable of taking an online examination must provide operations for: login(), startExam(), submitExam().

The university also supports different payment methods for examination fees: Cash, Credit Card, Mobile Banking. Each payment method must perform payment differently.`,
    rejectionRules: [
      'The system must reject a registration if: (1) the student has exceeded the maximum credit limit, (2) the course is already full, (3) the student has not paid the required fee, or (4) the course registration deadline has passed.',
      'It must also reject an examination submission if: (1) the student has not registered for the course, (2) the examination time has expired, or (3) the student attempts to submit more than once.',
    ],
    oopPillars: [
      'Encapsulation: Private fields in Student with CGPA range check (0.00 to 4.00)',
      'Aggregation: Department and Teacher (Teacher exists independently and can transfer)',
      'Composition & Association: Course creates CourseRegistration objects',
      'Inheritance & Abstract Class: Student and Examination hierarchies',
      'Interface & Polymorphism: OnlineExaminable and PaymentMethod',
      'Exception Handling: Custom Exceptions for registration and exam rules',
    ],
    tasks: [
      'Design and implement the complete Java system.',
      'Your solution must demonstrate encapsulation, association, aggregation, composition, abstract class, interface, inheritance, method overriding, polymorphism, exception handling, and custom exceptions.',
    ],
    expectedOutput: STAGE_1_EXPECTED_OUTPUT,
    fullProjectCode: STAGE_1_UNIVERSITY_CODE,
    skeletonCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Design and implement your complete Java system here
        
    }
}
`,
  },
  {
    stageNumber: 2,
    title: 'Project 2: Smart Hospital Patient & Appointment Management System',
    topic: 'Patients, Doctors, Wards & Online Checkups',
    lineCountBadge: 'Full OOP System',
    problemStatement: `A hospital wants to develop a Smart Hospital Management System that manages patients, doctors, departments, wards, room bookings, medical services, and online checkups.

A Patient has a patient ID, name, age, and current booked days. These details must be protected from direct access. Age must remain between 0 and 120, and a patient cannot book a ward if their total booked days exceed the hospital's maximum stay limit.

The hospital contains several HospitalDepartment objects. Each department has multiple doctors. However, doctors are hospital employees and may be transferred from one department to another. A doctor therefore must be able to exist independently of a particular department.

Each department has several wards. A ward contains its ward code, ward name, stay days, and duty doctor. Patients can book multiple wards, and a ward can hold multiple patients. Whenever a patient books a ward, a RoomBooking object is created containing the booking date and shift. A booking is meaningful only for that particular patient-ward relationship.

The hospital has different categories of patients: GeneralPatient, InsuredPatient, EmergencyPatient. All patients must calculate their hospital bill, but the calculation differs for each category.

The hospital also conducts different medical services: LabTestService, SurgeryService, OnlineCheckupService. Each service has common properties, but the way health scores and service fees are calculated differs depending on the service type. Any class capable of taking an online checkup must provide operations for: login(), startConsultation(), downloadPrescription().

The hospital also supports different payment methods for deposits: Cash, Credit Card, Mobile Banking. Each payment method must perform payment differently.`,
    rejectionRules: [
      'The system must reject a ward booking if: (1) the patient has exceeded the maximum stay limit, (2) the ward is already full, (3) the patient has not paid the advance deposit, or (4) the booking time has passed.',
      'It must also reject a medical service if: (1) the patient has not booked the ward, (2) the service hours have expired, or (3) the patient attempts to request the same service more than once.',
    ],
    oopPillars: [
      'Encapsulation: Private fields in Patient with Age range check (0 to 120)',
      'Aggregation: HospitalDepartment and Doctor (Doctor exists independently and can transfer)',
      'Composition & Association: Ward creates RoomBooking objects',
      'Inheritance & Abstract Class: Patient and MedicalService hierarchies',
      'Interface & Polymorphism: OnlineCheckupCapable and PaymentMethod',
      'Exception Handling: Custom Exceptions for booking and service rules',
    ],
    tasks: [
      'Design and implement the complete Java system.',
      'Your solution must demonstrate encapsulation, association, aggregation, composition, abstract class, interface, inheritance, method overriding, polymorphism, exception handling, and custom exceptions.',
    ],
    expectedOutput: STAGE_2_EXPECTED_OUTPUT,
    fullProjectCode: STAGE_2_HOSPITAL_CODE,
    skeletonCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Design and implement your complete Java system here
        
    }
}
`,
  },
  {
    stageNumber: 3,
    title: 'Project 3: Smart Library Book & Membership Management System',
    topic: 'Members, Librarians, Books & E-Book Reader',
    lineCountBadge: 'Full OOP System',
    problemStatement: `A library wants to develop a Smart Library Management System that manages members, librarians, library branches, book sections, borrow records, reading activities, and online e-books.

A Member has a member ID, name, rating, and current borrowed books count. These details must be protected from direct access. The rating must remain between 1.0 and 5.0, and a member cannot borrow books if their total borrowed books exceed the library's maximum book limit.

The library contains several LibraryBranch objects. Each branch has multiple librarians. However, librarians are library employees and may be transferred from one branch to another. A librarian therefore must be able to exist independently of a particular branch.

Each branch offers several book sections. A book section contains its section code, title, book pack count, and manager. Members can borrow from multiple sections, and a section can serve multiple members. Whenever a member borrows from a section, a BorrowRecord object is created containing the borrow date and month. A borrow record is meaningful only for that particular member-section relationship.

The library has different categories of members: RegularMember, StudentMember, ResearcherMember. All members must calculate their membership bill, but the calculation differs for each category.

The library also offers different reading activities: PrintedBookActivity, JournalActivity, EBookActivity. Each activity has common properties, but the way reading points and activity fees are calculated differs depending on the material type. Any class capable of using the online e-book reader must provide operations for: login(), openEBook(), submitReview().

The library also supports different payment methods for membership fees: Cash, Credit Card, Mobile Banking. Each payment method must perform payment differently.`,
    rejectionRules: [
      'The system must reject a book borrow request if: (1) the member has exceeded the maximum book limit, (2) all copies in the section are already taken, (3) the member has not paid the membership fee, or (4) the library borrowing hours have closed.',
      'It must also reject a book return submission if: (1) the member did not borrow from the section, (2) the return time has expired, or (3) the member attempts to return the same item more than once.',
    ],
    oopPillars: [
      'Encapsulation: Private fields in Member with Rating range check (1.0 to 5.0)',
      'Aggregation: LibraryBranch and Librarian (Librarian exists independently and can transfer)',
      'Composition & Association: BookSection creates BorrowRecord objects',
      'Inheritance & Abstract Class: Member and ReadingActivity hierarchies',
      'Interface & Polymorphism: OnlineReaderCapable and PaymentMethod',
      'Exception Handling: Custom Exceptions for borrowing and return rules',
    ],
    tasks: [
      'Design and implement the complete Java system.',
      'Your solution must demonstrate encapsulation, association, aggregation, composition, abstract class, interface, inheritance, method overriding, polymorphism, exception handling, and custom exceptions.',
    ],
    expectedOutput: STAGE_3_EXPECTED_OUTPUT,
    fullProjectCode: STAGE_3_LIBRARY_CODE,
    skeletonCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Design and implement your complete Java system here
        
    }
}
`,
  },
  {
    stageNumber: 4,
    title: 'Project 4: Smart Online Shopping & Order Delivery System',
    topic: 'Customers, Riders, Products & Order Tracking',
    lineCountBadge: 'Full OOP System',
    problemStatement: `An online marketplace wants to develop a Smart Online Shopping & Delivery System that manages customers, delivery riders, stores, products, order records, delivery services, and live order tracking.

A Customer has a customer ID, name, loyalty points, and current ordered items count. These details must be protected from direct access. Loyalty points must remain between 0 and 1000, and a customer cannot order products if their total ordered items exceed the store's maximum item limit.

The marketplace contains several Store objects. Each store has multiple delivery riders. However, delivery riders are company employees and may be transferred from one store to another. A delivery rider therefore must be able to exist independently of a particular store.

Each store sells several products. A product contains its product code, title, bundle quantity, and assigned rider. Customers can order multiple products, and a product can be ordered by multiple customers. Whenever a customer orders a product, an OrderRecord object is created containing the order date and invoice number. An order record is meaningful only for that particular customer-product relationship.

The marketplace has different categories of customers: RegularCustomer, PrimeCustomer, WholesaleCustomer. All customers must calculate their shopping bill, but the calculation differs for each category.

The marketplace also provides different delivery services: StandardDelivery, ExpressDelivery, DroneDelivery. Each delivery service has common properties, but the way reward points and delivery fees are calculated differs depending on the delivery type. Any class capable of live order tracking must provide operations for: login(), trackOrder(), confirmDelivery().

The marketplace also supports different payment methods: Cash, Credit Card, Mobile Banking. Each payment method must perform payment differently.`,
    rejectionRules: [
      'The system must reject a product order if: (1) the customer has exceeded the maximum item limit, (2) the product is out of stock, (3) the customer has not completed payment, or (4) the sale time has ended.',
      'It must also reject a delivery confirmation if: (1) the customer did not order the product, (2) the delivery time window has expired, or (3) the customer attempts to confirm delivery more than once.',
    ],
    oopPillars: [
      'Encapsulation: Private fields in Customer with Loyalty Points check (0 to 1000)',
      'Aggregation: Store and DeliveryRider (Rider exists independently and can transfer)',
      'Composition & Association: Product creates OrderRecord objects',
      'Inheritance & Abstract Class: Customer and DeliveryService hierarchies',
      'Interface & Polymorphism: OnlineTrackable and PaymentMethod',
      'Exception Handling: Custom Exceptions for order and delivery rules',
    ],
    tasks: [
      'Design and implement the complete Java system.',
      'Your solution must demonstrate encapsulation, association, aggregation, composition, abstract class, interface, inheritance, method overriding, polymorphism, exception handling, and custom exceptions.',
    ],
    expectedOutput: STAGE_4_EXPECTED_OUTPUT,
    fullProjectCode: STAGE_4_SHOPPING_CODE,
    skeletonCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Design and implement your complete Java system here
        
    }
}
`,
  },
  {
    stageNumber: 5,
    title: 'Project 5: Smart Hotel Room Booking & Guest Management System',
    topic: 'Guests, Staff, Room Bookings & Smart Key Access',
    lineCountBadge: 'Full OOP System',
    problemStatement: `A hotel chain wants to develop a Smart Hotel Room Booking & Guest Management System that manages guests, hotel staff, hotel branches, room packages, stay reservations, hotel services, and smart room key access.

A Guest has a guest ID, name, review rating, and current booked nights. These details must be protected from direct access. The review rating must remain between 1.0 and 5.0, and a guest cannot book a room if their total booked nights exceed the hotel's maximum stay limit.

The hotel chain contains several HotelBranch objects. Each branch has multiple staff members. However, staff members are hotel employees and may be transferred from one branch to another. A staff member therefore must be able to exist independently of a particular branch.

Each branch offers several room packages. A room package contains its room code, title, package nights, and manager. Guests can book multiple rooms, and a room package can be booked by multiple guests. Whenever a guest books a room package, a StayReservation object is created containing the check-in date and season. A reservation is meaningful only for that particular guest-room relationship.

The hotel has different categories of guests: RegularGuest, VIPGuest, CorporateGuest. All guests must calculate their room rent, but the calculation differs for each category.

The hotel also offers different hotel services: DiningService, SpaService, LaundryService. Each service has common properties, but the way loyalty points and service charges are calculated differs depending on the service type. Any class capable of using smart room key access must provide operations for: login(), unlockDoor(), requestCheckout().

The hotel also supports different payment methods for advance booking fees: Cash, Credit Card, Mobile Banking. Each payment method must perform payment differently.`,
    rejectionRules: [
      'The system must reject a room booking if: (1) the guest has exceeded the maximum stay limit, (2) the room is already booked, (3) the guest has not paid the advance booking fee, or (4) the booking deadline has passed.',
      'It must also reject a hotel service request if: (1) the guest has not booked the room, (2) the service hours have expired, or (3) the guest attempts to request the same service more than once.',
    ],
    oopPillars: [
      'Encapsulation: Private fields in Guest with Review Rating check (1.0 to 5.0)',
      'Aggregation: HotelBranch and HotelStaff (Staff exists independently and can transfer)',
      'Composition & Association: RoomPackage creates StayReservation objects',
      'Inheritance & Abstract Class: Guest and HotelService hierarchies',
      'Interface & Polymorphism: SmartKeyCapable and PaymentMethod',
      'Exception Handling: Custom Exceptions for booking and service rules',
    ],
    tasks: [
      'Design and implement the complete Java system.',
      'Your solution must demonstrate encapsulation, association, aggregation, composition, abstract class, interface, inheritance, method overriding, polymorphism, exception handling, and custom exceptions.',
    ],
    expectedOutput: STAGE_5_EXPECTED_OUTPUT,
    fullProjectCode: STAGE_5_HOTEL_CODE,
    skeletonCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Design and implement your complete Java system here
        
    }
}
`,
  },
];
