#include <iostream>
#include <WinSock2.h>
#include <windows.h>
#include <cstdio>
#include <string>
#include "incl/httplib.h"
#include "incl/dotenv.h"
#include "incl/json.hpp"

#define MAX_PROJECT 255
#define Author "IzanamiiDevv"

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    env_value PORT_S = dotenv::readlocal("PORT");
    unsigned short PORT = PORT_S.has_value() ? std::atoi(PORT_S->c_str()) : 0;
    if(!PORT) return EXIT_FAILURE; 
    httplib::Server svr;
    
    svr.Get("/", [](const httplib::Request &req, httplib::Response &res) {
        res.status = 200;
        res.set_content("Welcome to PMC Server", "text/plain");
    });

    svr.Post("/cmd_new", [](const httplib::Request &req, httplib::Response &res) {
        try {
            
        } catch(const std::exception& e) {
            res.status = 400;
            res.set_content("Error", "text/plain");
        }
        
    });

    svr.Post("/cmd_commit", [](const httplib::Request &req, httplib::Response &res) {
        try {
            nlohmann::json jsonData = nlohmann::json::parse(req.body);
            res.status = 200;
            res.set_content(jsonData["command"], "text/plain");
        } catch(const std::exception &e) {
            res.status = 400;
            res.set_content("Error", "text/plain");
        }
    });
    
    svr.listen("localhost", PORT);
    return EXIT_SUCCESS;
}