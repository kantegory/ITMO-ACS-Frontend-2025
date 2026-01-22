<template>
<footer>
    <div class="footer-row">
        <div class="footer-col">
            <h3>GreenRent</h3>
            <p>Аренда недвижимости в любом городе России.</p>
        </div>

        <div class="footer-col">
            <h3>Контакты</h3>
            <p>+7 (999) 123-45-67</p>
            <p>+7 (911) 646-90-49</p>
        </div>

        <div class="footer-col">
            <h3>Мы в соцсетях</h3>
            <a href="#">VK</a><br>
            <a href="#">Telegram</a><br>
            <a href="#">YouTube</a>
        </div>

        <div class="footer-col">
            <h3>Адрес</h3>
            <p>г. Москва, деловой центр «ГринТауэр», офис 304</p>
        </div>
    </div>
</footer>
</template>

<script setup></script>

<style lang="css" scoped>
footer {
    background: var(--bg-surface);
    padding: 30px 40px; 
    margin-top: 40px;
    box-shadow: 0 -3px 15px rgba(0,0,0,0.1);
}

footer .footer-row { 
    display: flex; 
    justify-content: space-between; 
}

footer .footer-col { max-width: 300px; }

footer h3 { color: var(--green-main); }

footer a { 
    color: var(--green-accent); 
    text-decoration: none; 
}
</style>