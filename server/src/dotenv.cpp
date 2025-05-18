#include "../incl/dotenv.h"
#include <fstream>
#include <string>
#include <optional>
#include <algorithm>

namespace dotenv {
    env_value readlocal(const std::string& variable) {
        std::ifstream file(".env");
        if (!file.is_open()) return std::nullopt;

        std::string line;

        while (std::getline(file, line)) {
            if (line.empty() || line[0] == '#') continue;

            std::size_t eq_pos = line.find('=');
            if (eq_pos == std::string::npos) continue;

            std::string key = line.substr(0, eq_pos);
            std::string val = line.substr(eq_pos + 1);

            key.erase(0, key.find_first_not_of(" \t\n\r"));
            key.erase(key.find_last_not_of(" \t\n\r") + 1);
            val.erase(0, val.find_first_not_of(" \t\n\r"));
            val.erase(val.find_last_not_of(" \t\n\r") + 1);

            if (key == variable) {
                return val;
            }
        }

        return std::nullopt;
    }
}