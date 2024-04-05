function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  var main = document.getElementById("main");
  sidebar.classList.toggle("minimized");

  if (sidebar.classList.contains("minimized")) {
    main.style.marginLeft = "80px";
  } else {
    main.style.marginLeft = "250px";
  }
}


document.addEventListener('DOMContentLoaded', (event) => {
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  sidebarItems.forEach(item => {
    item.addEventListener('click', function () {
      sidebarItems.forEach(i => {
        i.classList.remove('item-active');
      });

      this.classList.add('item-active');
    });
  });
});

