// View all applications
window.internshipApplications.getAll()

// View statistics
window.internshipApplications.showStats()

// Export to JSON file
window.internshipApplications.exportToJSON()

// Export to CSV file
window.internshipApplications.exportToCSV()

// Search by email
window.internshipApplications.getByEmail("user@example.com")

// Search by technology
window.internshipApplications.getByTechnology("Flutter Development")

// Download a specific resume
window.internshipApplications.downloadResume("1234567890")

// Delete specific application
window.internshipApplications.deleteById("1234567890")

// Delete all (with confirmation)
window.internshipApplications.deleteAll()