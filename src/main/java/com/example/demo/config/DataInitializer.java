package com.example.demo.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.demo.model.Admin;
import com.example.demo.model.Course;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.CourseRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired private CourseRepository courseRepository;
    @Autowired private AdminRepository adminRepository;

    @Override
    public void run(String... args){
        if(adminRepository.count() == 0){
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setFullName("Exam Controller");
            adminRepository.save(admin);
            System.out.println("Default admin: admin / admin123");
        }
        if(courseRepository.count() == 0){
            String[][] courses = {
                {"MA101","Engineering Mathematics I","1","4","02-05-2026","FN","REGULAR"},
                {"PH101","Engineering Physics","1","4","04-05-2026","FN","REGULAR"},
                {"CY101","Engineering Chemistry","1","4","06-05-2026","AN","REGULAR"},
                {"CS101","Problem Solving & C Programming","1","4","08-05-2026","FN","REGULAR"},
                {"ME101","Engineering Graphics","1","3","10-05-2026","AN","REGULAR"},
                {"HS101","Technical English","1","3","12-05-2026","FN","REGULAR"},
                {"MA201","Engineering Mathematics II","2","4","02-05-2026","AN","REGULAR"},
                {"PH201","Physics for Engineers","2","4","04-05-2026","AN","REGULAR"},
                {"CS201","Data Structures","2","4","06-05-2026","FN","REGULAR"},
                {"EC201","Basic Electronics","2","3","08-05-2026","AN","REGULAR"},
                {"ME201","Workshop Practice","2","3","10-05-2026","FN","REGULAR"},
                {"HS201","Professional Communication","2","3","12-05-2026","AN","REGULAR"},
                {"CS301","Object Oriented Programming","3","4","02-05-2026","FN","REGULAR"},
                {"CS302","Computer Organization","3","4","04-05-2026","AN","REGULAR"},
                {"CS303","Discrete Mathematics","3","4","06-05-2026","FN","REGULAR"},
                {"CS304","Database Management Systems","3","4","08-05-2026","AN","REGULAR"},
                {"MA301","Probability and Statistics","3","4","10-05-2026","FN","REGULAR"},
                {"CS305","Digital Principles","3","3","12-05-2026","AN","REGULAR"},
                {"CS401","Operating Systems","4","4","02-05-2026","FN","REGULAR"},
                {"CS402","Computer Networks","4","4","04-05-2026","AN","REGULAR"},
                {"CS403","Design and Analysis of Algorithms","4","4","06-05-2026","FN","REGULAR"},
                {"CS404","Software Engineering","4","4","08-05-2026","AN","REGULAR"},
                {"CS405","Microprocessors","4","3","10-05-2026","FN","REGULAR"},
                {"MA401","Numerical Methods","4","4","12-05-2026","FN","REGULAR"},
                {"CS501","Theory of Computation","5","4","02-05-2026","FN","REGULAR"},
                {"CS502","Compiler Design","5","4","04-05-2026","AN","REGULAR"},
                {"CS503","Artificial Intelligence","5","4","06-05-2026","FN","REGULAR"},
                {"CS504","Web Technology","5","4","08-05-2026","AN","REGULAR"},
                {"CS505","Computer Graphics","5","3","10-05-2026","FN","REGULAR"},
                {"CS506","Embedded Systems","5","3","12-05-2026","AN","REGULAR"},
                {"CS601","Machine Learning","6","4","02-05-2026","FN","REGULAR"},
                {"CS602","Cloud Computing","6","4","04-05-2026","AN","REGULAR"},
                {"CS603","Cryptography and Network Security","6","4","06-05-2026","FN","REGULAR"},
                {"CS604","Mobile Application Development","6","4","08-05-2026","AN","REGULAR"},
                {"CS605","Big Data Analytics","6","3","10-05-2026","FN","REGULAR"},
                {"CS606","Internet of Things","6","3","12-05-2026","AN","REGULAR"},
                {"CS701","Deep Learning","7","4","02-05-2026","FN","REGULAR"},
                {"CS702","Natural Language Processing","7","4","04-05-2026","AN","REGULAR"},
                {"CS703","Distributed Systems","7","4","06-05-2026","FN","REGULAR"},
                {"CS704","Software Testing","7","3","08-05-2026","AN","REGULAR"},
                {"CS705","Information Retrieval","7","3","10-05-2026","FN","REGULAR"},
                {"CS706","Ethics in Computing","7","3","12-05-2026","AN","REGULAR"},
                {"CS801","Project Work","8","6","02-05-2026","FN","REGULAR"},
                {"CS802","Entrepreneurship Development","8","3","04-05-2026","AN","REGULAR"},
                {"CS803","Professional Elective IV","8","4","06-05-2026","FN","REGULAR"},
                {"CS804","Open Elective II","8","3","08-05-2026","AN","REGULAR"},
                {"CS805","Seminar","8","2","10-05-2026","FN","REGULAR"},
                {"CS806","Industrial Training","8","2","12-05-2026","AN","REGULAR"},
            };
            for(String[] c : courses){
                Course course = new Course();
                course.setCourseCode(c[0]);
                course.setCourseName(c[1]);
                course.setSemester(Integer.parseInt(c[2]));
                course.setCredits(Integer.parseInt(c[3]));
                course.setExamDate(c[4]);
                course.setExamSession(c[5]);
                course.setCourseType(c[6]);
                courseRepository.save(course);
            }
            System.out.println("48 courses loaded for semesters 1-8.");
        }
    }
}
