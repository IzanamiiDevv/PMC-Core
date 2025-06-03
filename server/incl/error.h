#pragma once
#include "./httplib.h"

namespace PMC_ERROR {
    void Send(httplib::Response &response, const char* message);
}