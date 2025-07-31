import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.mainFooter}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <div className={styles.footerLogo}>
                        <span className={styles.logoIcon}>📦</span>
                        <span className={styles.logoText}>Gestor de Inventario</span>
                    </div>
                    <p className={styles.footerDescription}>
                        Sistema completo de gestión de inventario para empresas modernas.
                    </p>
                </div>

                <div className={styles.footerSection}>
                    <h4>Enlaces Rápidos</h4>
                    <ul className={styles.footerLinks}>
                        <li><a href="/productos">Productos</a></li>
                        <li><a href="/categorias">Categorías</a></li>
                        <li><a href="/reportes">Reportes</a></li>
                        <li><a href="/soporte">Soporte</a></li>
                    </ul>
                </div>

                <div className={styles.footerSection}>
                    <h4>Contacto</h4>
                    <ul className={styles.footerContact}>
                        <li>
                            <span>📧</span>
                            <a href="mailto:soporte@gestorinventario.com">
                                soporte@gestorinventario.com
                            </a>
                        </li>
                        <li>
                            <span>📞</span>
                            <a href="tel:+1234567890">+1 (234) 567-890</a>
                        </li>
                        <li>
                            <span>📍</span>
                            <span>Ciudad, País</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.footerSection}>
                    <h4>Seguinos</h4>
                    <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialLink}>
                            <span>📘</span>
                            Facebook
                        </a>
                        <a href="#" className={styles.socialLink}>
                            <span>🐦</span>
                            Twitter
                        </a>
                        <a href="#" className={styles.socialLink}>
                            <span>💼</span>
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className={styles.footerBottomContent}>
                    <p>&copy; {currentYear} Gestor de Inventario. Todos los derechos reservados.</p>
                    <div className={styles.footerBottomLinks}>
                        <a href="/privacidad">Política de Privacidad</a>
                        <a href="/terminos">Términos de Uso</a>
                        <a href="/cookies">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;