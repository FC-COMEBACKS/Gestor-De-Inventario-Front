import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children, showHeader = true, showFooter = true }) => {
    return (
        <div className={styles.mainLayout}>
            {showHeader && <Header />}
            
            <main className={styles.mainContent}>
                {children}
            </main>
            
            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;