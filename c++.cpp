#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
#include <limits>
using namespace std;

/*
    CourseHub - Student Course Registration System
    Data Structures used:
      1. Singly Linked List -> student's registered courses
      2. Linear Search      -> search course by ID or name
      3. Bubble Sort        -> sort courses by ID, name, credits or seats

    This program is intentionally kept simple so the data-structure
    concepts can be explained easily to a professor.
*/

// --------------------------- COURSE ---------------------------

struct Course {
    string id;
    string name;
    int credits;
    int seats;
    int availableSeats;
};

// --------------------- LINKED LIST NODE -----------------------

struct Node {
    Course course;
    Node* next;

    Node(Course c) {
        course = c;
        next = nullptr;
    }
};

// -------------------- STUDENT LINKED LIST ---------------------

class RegistrationList {
private:
    Node* head;

public:
    RegistrationList() {
        head = nullptr;
    }

    // INSERTION at the end of the linked list
    bool insertCourse(Course c) {
        // Avoid duplicate registration
        Node* current = head;
        while (current != nullptr) {
            if (current->course.id == c.id)
                return false;
            current = current->next;
        }

        Node* newNode = new Node(c);

        if (head == nullptr) {
            head = newNode;
        } else {
            current = head;
            while (current->next != nullptr)
                current = current->next;

            current->next = newNode;
        }

        return true;
    }

    // DELETION from linked list
    bool deleteCourse(string courseId) {
        if (head == nullptr)
            return false;

        // Delete first node
        if (head->course.id == courseId) {
            Node* temp = head;
            head = head->next;
            delete temp;
            return true;
        }

        Node* current = head;

        while (current->next != nullptr) {
            if (current->next->course.id == courseId) {
                Node* temp = current->next;
                current->next = current->next->next;
                delete temp;
                return true;
            }
            current = current->next;
        }

        return false;
    }

    bool contains(string courseId) {
        Node* current = head;

        while (current != nullptr) {
            if (current->course.id == courseId)
                return true;

            current = current->next;
        }

        return false;
    }

    // Display linked-list nodes
    void display() {
        if (head == nullptr) {
            cout << "\nNo courses registered.\n";
            return;
        }

        Node* current = head;

        cout << "\nRegistered Courses (Linked List)\n";
        cout << "HEAD -> ";

        while (current != nullptr) {
            cout << "[" << current->course.id << "] -> ";
            current = current->next;
        }

        cout << "NULL\n";

        current = head;
        cout << "\nCourse Details:\n";

        while (current != nullptr) {
            cout << "  " << current->course.id
                 << " - " << current->course.name
                 << " (" << current->course.credits << " credits)\n";

            current = current->next;
        }
    }

    ~RegistrationList() {
        Node* current = head;

        while (current != nullptr) {
            Node* temp = current;
            current = current->next;
            delete temp;
        }
    }
};

// ---------------------- LINEAR SEARCH -------------------------

int linearSearch(const vector<Course>& courses, string key) {
    for (int i = 0; i < (int)courses.size(); i++) {

        // Search by Course ID OR Course Name
        if (courses[i].id == key || courses[i].name == key)
            return i;
    }

    return -1;
}

// ----------------------- BUBBLE SORT --------------------------

void bubbleSort(vector<Course>& courses, int option) {

    int n = courses.size();

    for (int i = 0; i < n - 1; i++) {

        bool swapped = false;

        for (int j = 0; j < n - i - 1; j++) {

            bool shouldSwap = false;

            if (option == 1)
                shouldSwap = courses[j].id > courses[j + 1].id;

            else if (option == 2)
                shouldSwap = courses[j].name > courses[j + 1].name;

            else if (option == 3)
                shouldSwap = courses[j].credits > courses[j + 1].credits;

            else if (option == 4)
                shouldSwap =
                    courses[j].availableSeats >
                    courses[j + 1].availableSeats;

            if (shouldSwap) {
                swap(courses[j], courses[j + 1]);
                swapped = true;
            }
        }

        // Optimization: if no swap happened, array is already sorted
        if (!swapped)
            break;
    }
}

// ----------------------- DISPLAY COURSES ----------------------

void displayCourses(const vector<Course>& courses) {

    cout << "\n";
    cout << left
         << setw(10) << "ID"
         << setw(30) << "Course Name"
         << setw(10) << "Credits"
         << setw(10) << "Seats"
         << setw(12) << "Available"
         << "\n";

    cout << string(72, '-') << "\n";

    for (const Course& c : courses) {
        cout << left
             << setw(10) << c.id
             << setw(30) << c.name
             << setw(10) << c.credits
             << setw(10) << c.seats
             << setw(12) << c.availableSeats
             << "\n";
    }
}

// ------------------------- SEARCH -----------------------------

void searchCourse(const vector<Course>& courses) {

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    string key;
    cout << "\nEnter Course ID or exact Course Name: ";
    getline(cin, key);

    int position = linearSearch(courses, key);

    if (position == -1) {
        cout << "Course not found.\n";
    } else {
        cout << "\nCourse Found!\n";
        cout << "ID              : " << courses[position].id << "\n";
        cout << "Name            : " << courses[position].name << "\n";
        cout << "Credits         : " << courses[position].credits << "\n";
        cout << "Total Seats     : " << courses[position].seats << "\n";
        cout << "Available Seats : " << courses[position].availableSeats << "\n";
        cout << "Array Position  : " << position << "\n";
    }
}

// -------------------------- SORT ------------------------------

void sortCourses(vector<Course>& courses) {

    int option;

    cout << "\nSort Courses By:\n";
    cout << "1. Course ID\n";
    cout << "2. Course Name\n";
    cout << "3. Credits\n";
    cout << "4. Available Seats\n";
    cout << "Enter choice: ";
    cin >> option;

    if (option < 1 || option > 4) {
        cout << "Invalid sorting option.\n";
        return;
    }

    bubbleSort(courses, option);

    cout << "\nCourses after Bubble Sort:\n";
    displayCourses(courses);
}

// ----------------------- REGISTER COURSE ----------------------

void registerCourse(
    vector<Course>& courses,
    RegistrationList& registrations
) {

    string id;

    cout << "\nEnter Course ID to register: ";
    cin >> id;

    int position = linearSearch(courses, id);

    if (position == -1) {
        cout << "Course not found.\n";
        return;
    }

    Course& selectedCourse = courses[position];

    if (selectedCourse.availableSeats <= 0) {
        cout << "Registration failed: No seats available.\n";
        return;
    }

    if (registrations.contains(selectedCourse.id)) {
        cout << "Registration failed: Course already registered.\n";
        return;
    }

    if (registrations.insertCourse(selectedCourse)) {
        selectedCourse.availableSeats--;

        cout << "Course registered successfully.\n";
        cout << "Linked List insertion completed.\n";
    }
}

// ------------------------- DROP COURSE ------------------------

void dropCourse(
    vector<Course>& courses,
    RegistrationList& registrations
) {

    string id;

    cout << "\nEnter Course ID to drop: ";
    cin >> id;

    int position = linearSearch(courses, id);

    if (position == -1) {
        cout << "Course not found.\n";
        return;
    }

    if (registrations.deleteCourse(id)) {
        courses[position].availableSeats++;

        cout << "Course dropped successfully.\n";
        cout << "Linked List deletion completed.\n";
    } else {
        cout << "This course is not in the student's registration list.\n";
    }
}

// ---------------------- DATA STRUCTURE DEMO -------------------

void explainDataStructures() {

    cout << "\n==============================================\n";
    cout << "       DATA STRUCTURE CONCEPTS USED\n";
    cout << "==============================================\n";

    cout << "\n1. SINGLY LINKED LIST\n";
    cout << "   Each registered course is stored in a Node.\n";
    cout << "   Each Node contains:\n";
    cout << "      - Course information\n";
    cout << "      - Pointer to the next Node\n";
    cout << "   Registration = INSERTION\n";
    cout << "   Drop Course  = DELETION\n";
    cout << "   Traversal    = DISPLAY registered courses\n";

    cout << "\n2. LINEAR SEARCH\n";
    cout << "   Courses are checked one by one from the beginning.\n";
    cout << "   It is used to find a Course ID or Course Name.\n";
    cout << "   Time Complexity: O(n)\n";

    cout << "\n3. BUBBLE SORT\n";
    cout << "   Adjacent course records are compared and swapped.\n";
    cout << "   Courses can be sorted by ID, name, credits or seats.\n";
    cout << "   Time Complexity: O(n^2) worst/average case.\n";

    cout << "\n4. VECTOR\n";
    cout << "   The available-course collection is stored in a vector.\n";
    cout << "   It makes the course list easy to search and sort.\n";
}

// --------------------------- MAIN -----------------------------

int main() {

    vector<Course> courses = {
        {"CS101", "Programming Fundamentals", 4, 60, 60},
        {"CS102", "Data Structures",           4, 50, 50},
        {"CS103", "Database Management",       3, 40, 40},
        {"CS104", "Operating Systems",         4, 45, 45},
        {"CS105", "Java Programming",          3, 55, 55},
        {"CS106", "Computer Networks",         3, 50, 50}
    };

    RegistrationList registrations;

    int choice;

    cout << "==============================================\n";
    cout << "       COURSEHUB - COURSE REGISTRATION\n";
    cout << "==============================================\n";
    cout << "Student: Demo Student\n";
    cout << "Student ID: STU001\n";

    do {
        cout << "\n\n--------------- MAIN MENU ----------------\n";
        cout << "1. View Available Courses\n";
        cout << "2. Search Course (Linear Search)\n";
        cout << "3. Sort Courses (Bubble Sort)\n";
        cout << "4. Register Course (Linked List Insertion)\n";
        cout << "5. View My Courses (Linked List Traversal)\n";
        cout << "6. Drop Course (Linked List Deletion)\n";
        cout << "7. Explain Data Structures\n";
        cout << "0. Exit\n";
        cout << "------------------------------------------\n";
        cout << "Enter choice: ";
        cin >> choice;

        switch (choice) {

            case 1:
                displayCourses(courses);
                break;

            case 2:
                searchCourse(courses);
                break;

            case 3:
                sortCourses(courses);
                break;

            case 4:
                registerCourse(courses, registrations);
                break;

            case 5:
                registrations.display();
                break;

            case 6:
                dropCourse(courses, registrations);
                break;

            case 7:
                explainDataStructures();
                break;

            case 0:
                cout << "\nThank you for using CourseHub.\n";
                break;

            default:
                cout << "Invalid choice. Try again.\n";
        }

    } while (choice != 0);

    return 0;
}
