#pragma once
#include <algorithm>
#include <string>
#include <optional>

typedef std::optional<std::string> env_value;

namespace dotenv {
    env_value readlocal(const std::string& variable);
}