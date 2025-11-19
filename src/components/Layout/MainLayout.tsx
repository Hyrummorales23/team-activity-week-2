import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebar?: React.ReactNode;
}

export default function MainLayout({ 
  children, 
  showSidebar = false, 
  sidebar 
}: MainLayoutProps) {
  return (
    <div className={styles.layout}>
      {showSidebar && sidebar && (
        <div className={styles.sidebarWrapper}>
          {sidebar}
        </div>
      )}
      <main className={showSidebar ? styles.mainWithSidebar : styles.main}>
        {children}
      </main>
    </div>
  );
}
