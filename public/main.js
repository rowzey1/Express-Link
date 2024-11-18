let thumbUp = document.getElementsByClassName("thumbUp");
let thumbDown = document.getElementsByClassName("thumbDown");
let trash = document.getElementsByClassName("fa-trash-o");

console.log('Number of thumbUp elements:', thumbUp.length);
console.log('Number of thumbDown elements:', thumbDown.length);

Array.from(thumbUp).forEach(function(element) {
    element.addEventListener('click', function(){
        console.log('Thumb up clicked');
        const messageId = this.closest('.message').dataset.id;
        //uses PUT request to add like
        
        fetch('messages', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'messageId': messageId,
                'action': 'thumbUp'
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating vote');
        });
    });
});

Array.from(thumbDown).forEach(function(element) {
    element.addEventListener('click', function(){
        const messageId = this.closest('.message').dataset.id;
        const count = parseInt(this.querySelector('.count').innerText);
         //uses PUT(update) request to add dislike
        
        fetch('messages', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'messageId': messageId,
                'action': 'thumbDown'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating vote');
        });
    });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const messageId = this.closest('.message').dataset.id;
        
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'messageId': messageId
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

// Reply functionality
function showReplyForm(messageId) {
    document.getElementById(`reply-form-${messageId}`).style.display = 'block';
}

function hideReplyForm(messageId) { 
    document.getElementById(`reply-form-${messageId}`).style.display = 'none';
}

function submitReply(event, messageId) { //post request to create reply under message
    event.preventDefault();
    const form = event.target;
    const replyText = form.querySelector('textarea').value;

    fetch('/reply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messageId: messageId,
            reply: replyText
        })
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error posting reply');
    });
}

// Reply thumbs up/down
document.querySelectorAll('.reply-thumbUp, .reply-thumbDown').forEach(button => {
    button.addEventListener('click', function() {
        const messageId = this.dataset.messageId;
        const replyId = this.dataset.replyId;
        const action = this.classList.contains('reply-thumbUp') ? 'thumbUp' : 'thumbDown';
        
        console.log('Voting on reply:', {messageId, replyId, action});

        fetch('/replyVote', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messageId: messageId,
                replyId: replyId,
                action: action
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Vote success:', data);
            if (data.success) {
                // Update the count display
                const countSpan = this.querySelector('.count');
                const currentCount = parseInt(countSpan.textContent) || 0;
                countSpan.textContent = currentCount + 1;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error voting on reply');
        });
    });
});

//  message delete functionality
const deleteButtons = document.querySelectorAll('.delete');

deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const messageId = this.dataset.id;
        
        fetch('messages', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messageId: messageId
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Delete success:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting message');
        });
    });
});

// Reply deletion
document.querySelectorAll('.reply-delete').forEach(button => {
    button.addEventListener('click', function() {
        const messageId = this.closest('.message').dataset.id;
        const replyId = this.closest('.reply').dataset.id;
        
        fetch('/deleteReply', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messageId: messageId,
                replyId: replyId
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Reply delete success:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting reply');
        });
    });
});

