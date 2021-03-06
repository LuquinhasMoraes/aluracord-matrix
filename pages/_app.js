import { StoreProvider } from "../src/components/StoreProvider";

function GlobalStyle() {
    return (
      <style global jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          list-style: none;
        }
        body {
          font-family: 'Open Sans', sans-serif;
        }


        #box-panel-sticker {
          height: 150px;
          overflowY: scroll;
          margin-bottom: 20px
        }
        
        #box-panel-sticker::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.5);
        }
        
        #box-panel-sticker::-webkit-scrollbar {
          width: 12px;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.5);
        }
        
        #box-panel-sticker::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
          background-color: #7A25CA;
        }

        #main-box {
          height: 150px;
          overflowY: scroll;
          margin-bottom: 20px
        }
        
        #main-box::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          border-radius: 10px;background-color: rgba(255, 255, 255, 0.50);
        }
        
        #main-box::-webkit-scrollbar {
          width: 12px;
          border-radius: 10px;background-color: rgba(255, 255, 255, 0.50);
        }
        
        #main-box::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
          background-color: #7A25CA;
        }
        html, body, #__next {
          min-height: 100vh;
          display: flex;
          flex: 1;
        }
        a {
          color: white;
          text-decoration: none;
        }
        #__next {
          flex: 1;
        }
        #__next > * {
          flex: 1;
        }
      `}</style>
    );
}

export default function CustomApp({ Component, pageProps, router }) {
    return (
        <>
            <GlobalStyle/>
            <StoreProvider {...pageProps} router={router} >
              <Component {...pageProps} />   
            </StoreProvider>
        </>
    )
}