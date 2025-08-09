// Admin Panel JavaScript Functions

// Update submission status
async function updateStatus(submissionId, newStatus) {
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    
    try {
        const response = await fetch(`/admin/api/submission/${submissionId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success feedback
            button.innerHTML = '<i class="fas fa-check"></i> Updated!';
            button.classList.add('btn-success');
            
            // Reload after short delay
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            throw new Error(result.message || 'Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        
        // Show error state
        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        button.classList.add('btn-danger');
        
        // Reset button after delay
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
            button.classList.remove('btn-danger');
        }, 2000);
        
        alert('Error updating submission status: ' + error.message);
    }
}

// Update project progress
async function updateProgress(projectId, newProgress) {
    try {
        const response = await fetch(`/admin/api/project/${projectId}/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ progress: newProgress })
        });
        
        const result = await response.json();
        
        if (result.success) {
            location.reload();
        } else {
            alert('Failed to update project progress: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating progress:', error);
        alert('Error updating project progress');
    }
}

// Complete project
async function completeProject(projectId) {
    try {
        const response = await fetch(`/admin/api/project/${projectId}/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ progress: 100, status: 'completed' })
        });
        
        const result = await response.json();
        
        if (result.success) {
            location.reload();
        } else {
            alert('Failed to complete project: ' + result.message);
        }
    } catch (error) {
        console.error('Error completing project:', error);
        alert('Error completing project');
    }
}

// View project details (placeholder)
function viewProject(projectId) {
    alert(`Viewing project details for project ID: ${projectId}`);
}

// Auto-refresh dashboard data every 30 seconds
if (window.location.pathname === '/admin/dashboard') {
    setInterval(async () => {
        try {
            const response = await fetch('/admin/api/stats');
            const stats = await response.json();
            // Update stats if needed - could update DOM elements here
        } catch (error) {
            console.error('Failed to refresh stats:', error);
        }
    }, 30000);
}

// Format dates consistently
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}