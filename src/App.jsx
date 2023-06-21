import { Routes, Route } from "react-router-dom";
import { Navbar, Footer, Connect, ErrorFallback} from "./components";
import { ErrorBoundary } from "react-error-boundary";
import {
  Home,
  CategoryPage,
  UserDashboard,
  PublicEditor,
  ReadPublished,
  PrivateEditor,
  AdminDashboard,
  PublishedItem,
  CreatorPage,
  EditProfile,
  Page404,
} from "./Pages";

const App = () => {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      <div className="bg-field-bg">
        <Navbar />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => reloadPage()}
        >
          <Routes>
            <Route path="/connect" element={<Connect />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/private-pager" element={<PrivateEditor />} />
            <Route
              path="/read-published/:id/:title/:creator"
              element={<ReadPublished />}
            />
            <Route path="/publish-pager" element={<PublicEditor />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/category/:label/pagers" element={<CategoryPage />} />
            <Route
              path="/published-item/:id/:title/:category"
              element={<PublishedItem />}
            />
            <Route path="/creator" element={<CreatorPage />} />
            <Route
              path="/creator/:id/:creatorAddress/:creator"
              element={<CreatorPage />}
            />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/*" element={<Page404 />} />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </div>
  );
};

export default App;
