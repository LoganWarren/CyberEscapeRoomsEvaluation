function showMemberInfo(memberId) {
    // Hide all member info elements
    var infoElements = document.querySelectorAll('.info');
    infoElements.forEach(function(element) {
      element.style.display = 'none';
    });
  
    // Show the selected member's info element
    var selectedInfo = document.querySelector('.' + memberId + ' .info');
    if (selectedInfo.style.display === 'none') {
      selectedInfo.style.display = 'block';
    } else {
      selectedInfo.style.display = 'none';
    }
  }