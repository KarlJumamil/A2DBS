document.getElementById('staffForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        staffno: document.getElementById('staffno').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        position: document.getElementById('position').value.trim(),
        sex: document.getElementById('sex').value,
        branchNo: document.getElementById('branchNo').value.trim(),
        dob: document.getElementById('dob').value,
        salary: parseFloat(document.getElementById('salary').value),
        telephone: document.getElementById('telephone').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        email: document.getElementById('email').value.trim()
    };

    try {
        const response = await fetch('/api/hire-staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to hire staff');
        }

        const result = await response.text();
        alert(result);
        document.getElementById('staffForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Error hiring staff');
    }
});
