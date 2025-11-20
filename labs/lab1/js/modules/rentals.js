// получить все заявки
function getRentalApplications() {
    return JSON.parse(localStorage.getItem('rental_applications') || '[]');
}

// сохранить заявки
function saveRentalApplications(applications) {
    localStorage.setItem('rental_applications', JSON.stringify(applications));
}

// создать новую заявку на аренду
function createRentalApplication(propertyId, tenantId, formData) {
    const applications = getRentalApplications();
    const property = getPropertyById(propertyId);
    const tenant = getUserById(tenantId);

    const application = {
        id: Date.now(),
        propertyId: propertyId,
        tenantId: tenantId,
        ownerId: property.ownerId,
        propertyTitle: property.title,
        propertyAddress: property.location,
        propertyPrice: property.price,
        rentalType: property.rentalType,
        applicationDate: new Date().toISOString(),
        startDate: formData.startDate,
        duration: formData.duration,
        totalCost: property.price * formData.duration,
        status: 'pending',
        tenantName: formData.tenantName,
        tenantPhone: formData.tenantPhone,
        tenantEmail: formData.tenantEmail,
        message: formData.message || ''
    };

    applications.push(application);
    saveRentalApplications(applications);

    return application;
}

// обновить статус заявки
function updateRentalApplicationStatus(applicationId, status) {
    const applications = getRentalApplications();
    const application = applications.find(app => app.id === applicationId);

    if (application) {
        application.status = status;
        application.statusUpdateDate = new Date().toISOString();
        saveRentalApplications(applications);
        return true;
    }

    return false;
}

// получить заявки по арендатору
function getApplicationsByTenant(tenantId) {
    return getRentalApplications().filter(app => app.tenantId === tenantId);
}

// получить заявки по владельцу
function getApplicationsByOwner(ownerId) {
    return getRentalApplications().filter(app => app.ownerId === ownerId);
}

// получить заявки по объекту недвижимости
function getApplicationsByProperty(propertyId) {
    return getRentalApplications().filter(app => app.propertyId === propertyId);
}

// получить класс статуса для отображения
function getStatusClass(status) {
    const classMap = {
        'pending': 'bg-warning',
        'approved': 'bg-success',
        'rejected': 'bg-danger'
    };
    return classMap[status] || 'bg-secondary';
}

// экспорт функций
window.getRentalApplications = getRentalApplications;
window.createRentalApplication = createRentalApplication;
window.updateRentalApplicationStatus = updateRentalApplicationStatus;
window.getApplicationsByTenant = getApplicationsByTenant;
window.getApplicationsByOwner = getApplicationsByOwner;
window.getApplicationsByProperty = getApplicationsByProperty;
window.getStatusClass = getStatusClass;